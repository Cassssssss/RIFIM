export const DEFAULT_SENSITIVITY = { scroll: 1, zoom: 1, pan: 1, contrast: 1 };
export const SENSITIVITY_STORAGE_KEY = 'rifim.viewer.sensitivity.v1';

export function readSensitivity() {
  try {
    const saved = JSON.parse(localStorage.getItem(SENSITIVITY_STORAGE_KEY));
    return Object.fromEntries(Object.entries(DEFAULT_SENSITIVITY).map(([key, fallback]) => [
      key, typeof saved?.[key] === 'number' && Number.isFinite(saved[key])
        ? Math.max(0.25, Math.min(3, saved[key])) : fallback
    ]));
  } catch {
    return { ...DEFAULT_SENSITIVITY };
  }
}

// Keep sub-slice motion, but discard it when the gesture reverses direction.
export function accumulateSlices(remainder, delta, threshold, sensitivity) {
  const retained = Math.sign(remainder) === Math.sign(delta) ? remainder : 0;
  const total = retained + delta * sensitivity;
  const steps = Math.trunc(total / threshold);
  return { steps, remainder: total - steps * threshold };
}
