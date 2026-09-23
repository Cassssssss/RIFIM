import React, { useEffect, useRef, useState } from 'react';
import { SlidersHorizontal, Maximize, Minimize, X } from 'lucide-react';
import { DEFAULT_SENSITIVITY } from '../utils/viewerSensitivity';
import styles from './RadiologyViewer.module.css';

export default function ViewerSettings({ sensitivity, onChange, isMobile, containerRef }) {
  const [open, setOpen] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState('');
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)');
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const update = () => setFullscreen(
      (document.fullscreenElement || document.webkitFullscreenElement) === containerRef.current
    );
    document.addEventListener('fullscreenchange', update);
    document.addEventListener('webkitfullscreenchange', update);
    return () => {
      document.removeEventListener('fullscreenchange', update);
      document.removeEventListener('webkitfullscreenchange', update);
    };
  }, [containerRef]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector('input')?.focus();
    const dismiss = event => {
      if (!panelRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) setOpen(false);
    };
    const escape = event => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  const toggleFullscreen = async () => {
    setError('');
    try {
      const element = containerRef.current;
      if (fullscreen) {
        await (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else {
        await (element.requestFullscreen || element.webkitRequestFullscreen).call(element);
      }
    } catch {
      setError('Le plein écran est indisponible. Réessayez depuis votre navigateur.');
    }
  };
  const fullscreenSupported = Boolean(containerRef.current?.requestFullscreen || containerRef.current?.webkitRequestFullscreen);
  const fields = [
    ['scroll', 'Défilement des coupes'], ['zoom', 'Zoom'], ['pan', 'Déplacement'],
    ...(!isMobile ? [['contrast', 'Contraste et luminosité']] : [])
  ];

  return (
    <div className={styles.viewerSettings}>
      <button ref={triggerRef} type="button" className={styles.settingsButton}
        aria-expanded={open} aria-controls="viewer-sensitivity" onClick={() => setOpen(!open)}>
        <SlidersHorizontal size={16} aria-hidden="true" /> Sensibilité
      </button>
      {desktop && fullscreenSupported && (
        <button type="button" className={styles.settingsButton} onClick={toggleFullscreen} aria-pressed={fullscreen}>
          {fullscreen ? <Minimize size={16} aria-hidden="true" /> : <Maximize size={16} aria-hidden="true" />}
          {fullscreen ? 'Quitter le plein écran' : 'Plein écran'}
        </button>
      )}
      {error && <p className={styles.fullscreenError} role="alert">{error}</p>}
      {open && (
        <section ref={panelRef} id="viewer-sensitivity" className={styles.sensitivityPanel} aria-label="Sensibilité du viewer">
          <div className={styles.settingsHeading}>
            <strong>Sensibilité</strong>
            <button type="button" className={styles.settingsClose} aria-label="Fermer les réglages"
              onClick={() => { setOpen(false); triggerRef.current?.focus(); }}><X size={16} /></button>
          </div>
          <p>Ajustez la vitesse des gestes. Réglages mémorisés sur cet appareil.</p>
          {fields.map(([key, label]) => (
            <label key={key} className={styles.sensitivityField}>
              <span>{label}<output>{sensitivity[key].toLocaleString('fr-FR')}×</output></span>
              <input type="range" min="0.25" max="3" step="0.25" value={sensitivity[key]}
                aria-label={label} aria-valuetext={`${sensitivity[key]} fois la vitesse normale`}
                onChange={event => onChange({ ...sensitivity, [key]: Number(event.target.value) })} />
            </label>
          ))}
          <div className={styles.sensitivityLegend}><span>Plus lent</span><span>Plus rapide</span></div>
          <button type="button" className={styles.settingsReset} onClick={() => onChange({ ...DEFAULT_SENSITIVITY })}>Rétablir les valeurs par défaut</button>
        </section>
      )}
    </div>
  );
}
