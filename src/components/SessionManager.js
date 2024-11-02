import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const AlertOverlay = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 400px;
`;

const SessionManager = () => {
  const [showWarning, setShowWarning] = useState(false);
  const inactivityTimeout = 30 * 60 * 1000; // 30 minutes
  const warningTime = 5 * 60 * 1000; // 5 minutes avant la déconnexion
  let inactivityTimer;
  let warningTimer;

  const resetTimers = () => {
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);
    setShowWarning(false);

    // Définir le timer d'avertissement
    warningTimer = setTimeout(() => {
      setShowWarning(true);
    }, inactivityTimeout - warningTime);

    // Définir le timer de déconnexion
    inactivityTimer = setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }, inactivityTimeout);
  };

  const handleUserActivity = () => {
    resetTimers();
  };

  useEffect(() => {
    // Liste des événements à surveiller
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Ajouter les écouteurs d'événements
    events.forEach(eventName => {
      document.addEventListener(eventName, handleUserActivity);
    });

    // Initialiser les timers
    resetTimers();

    // Nettoyer les écouteurs d'événements à la destruction du composant
    return () => {
      events.forEach(eventName => {
        document.removeEventListener(eventName, handleUserActivity);
      });
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
    };
  }, []);

  if (!showWarning) return null;

  return (
    <AlertOverlay>
      <div className="flex flex-col gap-2">
        <div className="font-semibold text-amber-800">
          Attention : Déconnexion imminente
        </div>
        <div className="text-sm text-amber-700">
          Suite à une période d'inactivité, vous serez déconnecté dans 5 minutes.
          Interagissez avec la page pour réinitialiser le timer d'inactivité.
        </div>
        <button
          onClick={() => {
            handleUserActivity();
            setShowWarning(false);
          }}
          className="mt-2 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 text-sm"
        >
          Je suis toujours là
        </button>
      </div>
    </AlertOverlay>
  );
};

export default SessionManager;