import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Simulate } from 'react-dom/test-utils';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RadiologyViewer from './RadiologyViewer';
import axios from '../utils/axiosConfig';
import { readSensitivity, SENSITIVITY_STORAGE_KEY } from '../utils/viewerSensitivity';

jest.mock('../utils/axiosConfig', () => ({ get: jest.fn() }));
const images = Array.from({ length: 100 }, (_, index) => `https://example.test/slice-${index}.png`);
let host, root, mobile, fullscreenElement;
const button = text => [...host.querySelectorAll('button')].find(el => el.textContent.trim() === text);
const viewer = (side = 'single') => host.querySelector(`[data-viewer-side="${side}"]`);
const position = (side = 'single') => viewer(side).firstChild.textContent;
const click = element => act(() => Simulate.click(element));
const wheel = (deltaY, side = 'single') => act(() => viewer(side).dispatchEvent(new WheelEvent('wheel', { deltaY, bubbles: true, cancelable: true })));
const key = (target, value) => act(() => target.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true })));
const change = (label, value) => act(() => Simulate.change(host.querySelector(`input[aria-label="${label}"]`), { target: { value } }));
async function mount() {
  await act(async () => root.render(
    <MemoryRouter initialEntries={['/radiology-viewer/test']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes><Route path="/radiology-viewer/:caseId" element={<RadiologyViewer />} /></Routes>
    </MemoryRouter>
  ));
}

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  mobile = false;
  fullscreenElement = null;
  delete window.ontouchstart;
  Object.defineProperty(window, 'innerWidth', { value: 1440, configurable: true });
  Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, configurable: true });
  window.matchMedia = jest.fn(query => ({ matches: query.includes('coarse') ? mobile : !mobile, addEventListener: jest.fn(), removeEventListener: jest.fn() }));
  Object.defineProperty(document, 'fullscreenElement', { get: () => fullscreenElement, configurable: true });
  HTMLElement.prototype.requestFullscreen = jest.fn(function () {
    fullscreenElement = this;
    document.dispatchEvent(new Event('fullscreenchange'));
    return Promise.resolve();
  });
  document.exitFullscreen = jest.fn(() => {
    fullscreenElement = null;
    document.dispatchEvent(new Event('fullscreenchange'));
    return Promise.resolve();
  });
  axios.get.mockResolvedValue({ data: { folders: ['Test'], images: { Test: images }, folderMainImages: { Test: images[0] } } });
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  delete HTMLElement.prototype.requestFullscreen;
});

test('initial image loads; slower scrolling preserves small movements and faster scrolling advances more slices', async () => {
  await mount();
  expect(viewer().querySelector('img').src).toBe(images[0]);
  click(button('Sensibilité'));
  change('Défilement des coupes', '0.25');
  for (let i = 0; i < 3; i++) wheel(40);
  expect(position()).toBe('Test - 1/100');
  wheel(40);
  expect(position()).toBe('Test - 2/100');
  change('Défilement des coupes', '3');
  wheel(40);
  expect(position()).toBe('Test - 5/100');
  wheel(-4000);
  expect(position()).toBe('Test - 1/100');
  wheel(4000);
  expect(position()).toBe('Test - 100/100');
});

test('keyboard navigation remains one slice and does not intercept slider keys', async () => {
  await mount();
  click(button('Sensibilité'));
  change('Défilement des coupes', '3');
  key(document.body, 'ArrowDown');
  expect(position()).toBe('Test - 2/100');
  const slider = host.querySelector('input');
  key(slider, 'ArrowDown');
  key(slider, '2');
  expect(position()).toBe('Test - 2/100');
  expect(viewer('left')).toBeNull();
  key(slider, 'Escape');
  expect(host.querySelector('input')).toBeNull();
  expect(document.activeElement).toBe(button('Sensibilité'));
});

test('multiple viewers keep independent scroll remainders', async () => {
  await mount();
  click(button('Mode 1 viewer'));
  wheel(20, 'left');
  wheel(20, 'right');
  expect(position('left')).toBe('Test - 1/100');
  expect(position('right')).toBe('Test - 1/100');
  wheel(20, 'left');
  expect(position('left')).toBe('Test - 2/100');
  expect(position('right')).toBe('Test - 1/100');
});

test('settings persist, reset and tolerate invalid storage', async () => {
  localStorage.setItem(SENSITIVITY_STORAGE_KEY, '{invalid');
  await mount();
  click(button('Sensibilité'));
  change('Zoom', '2');
  expect(readSensitivity().zoom).toBe(2);
  click(button('Rétablir les valeurs par défaut'));
  expect(readSensitivity()).toEqual({ scroll: 1, zoom: 1, pan: 1, contrast: 1 });
});

test('fullscreen targets the whole viewer, follows Escape and reports browser rejection', async () => {
  await mount();
  await act(async () => Simulate.click(button('Plein écran')));
  expect(fullscreenElement.contains(viewer())).toBe(true);
  expect(fullscreenElement.contains(button('Sensibilité'))).toBe(true);
  expect(button('Quitter le plein écran')).toBeTruthy();
  await act(async () => Simulate.click(button('Quitter le plein écran')));
  expect(fullscreenElement).toBeNull();
  await act(async () => Simulate.click(button('Plein écran')));
  act(() => { fullscreenElement = null; document.dispatchEvent(new Event('fullscreenchange')); });
  expect(button('Plein écran')).toBeTruthy();
  HTMLElement.prototype.requestFullscreen.mockRejectedValueOnce(new Error('Denied'));
  await act(async () => Simulate.click(button('Plein écran')));
  expect(host.querySelector('[role="alert"]').textContent).toContain('indisponible');
});

test('mobile sensitivity controls affect one-finger scrolling and pinch zoom; fullscreen stays hidden', async () => {
  mobile = true;
  Object.defineProperty(window, 'innerWidth', { value: 390, configurable: true });
  Object.defineProperty(navigator, 'maxTouchPoints', { value: 5, configurable: true });
  await mount();
  expect(button('Plein écran')).toBeUndefined();
  click(button('Sensibilité'));
  expect(host.querySelectorAll('input')).toHaveLength(3);
  change('Défilement des coupes', '2');
  change('Zoom', '2');
  const touches = y => [{ clientX: 100, clientY: y }];
  act(() => Simulate.touchStart(viewer(), { touches: touches(100) }));
  act(() => Simulate.touchMove(viewer(), { touches: touches(108) }));
  expect(position()).toBe('Test - 3/100');
  act(() => Simulate.touchEnd(viewer(), { touches: [], changedTouches: touches(108) }));
  const pinch = distance => [{ clientX: 0, clientY: 0 }, { clientX: distance, clientY: 0 }];
  act(() => Simulate.touchStart(viewer(), { touches: pinch(100) }));
  act(() => Simulate.touchMove(viewer(), { touches: pinch(150) }));
  expect(viewer().querySelector('img').style.transform).toContain('scale(2.25)');
});

test('mouse zoom, pan and contrast use their own sensitivity on a touchscreen computer', async () => {
  Object.defineProperty(navigator, 'maxTouchPoints', { value: 5, configurable: true });
  await mount();
  expect(button('Plein écran')).toBeTruthy();
  click(button('Sensibilité'));
  change('Zoom', '2');
  change('Déplacement', '0.5');
  change('Contraste et luminosité', '0.25');
  const drag = (button, shiftKey, x, y) => {
    act(() => Simulate.mouseDown(viewer(), { button, shiftKey, clientX: 100, clientY: 100 }));
    act(() => Simulate.mouseMove(viewer(), { clientX: 100 + x, clientY: 100 + y }));
    act(() => Simulate.mouseUp(viewer()));
  };
  drag(0, true, 20, 10);
  expect(viewer().querySelector('img').style.transform).toContain('translate(10px, 5px)');
  drag(2, true, 20, -10);
  expect(viewer().querySelector('img').style.filter).toBe('contrast(110%) brightness(105%)');
  drag(2, false, 0, -100);
  expect(viewer().querySelector('img').style.transform).toContain(`scale(${Math.exp(0.2)})`);
});
