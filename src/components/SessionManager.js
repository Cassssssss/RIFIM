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
  const updateInterval = 10000; // Mise à jour toutes les 10 secondes

  useEffect(() => {
    // Fonction pour mettre à jour le timestamp d'activité
    const updateLastActivity = () => {
      localStorage.setItem('lastActivityTimestamp', Date.now().toString());
    };

    // Fonction pour vérifier l'inactivité
    const checkInactivity = () => {
      const lastActivity = parseInt(localStorage.getItem('lastActivityTimestamp') || '0');
      const timeSinceLastActivity = Date.now() - lastActivity;

      if (timeSinceLastActivity >= inactivityTimeout) {
        // Déconnexion
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login';
      } else if (timeSinceLastActivity >= (inactivityTimeout - warningTime)) {
        // Afficher l'avertissement
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    // Événements à surveiller
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Gestionnaire d'événements pour l'activité
    const handleUserActivity = () => {
      updateLastActivity();
      setShowWarning(false);
    };

    // Ajouter les écouteurs d'événements
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    // Initialiser le timestamp d'activité
    updateLastActivity();

    // Configurer la vérification périodique
    const intervalCheck = setInterval(checkInactivity, updateInterval);

    // Écouter les changements de localStorage dans les autres fenêtres
    const handleStorageChange = (e) => {
      if (e.key === 'lastActivityTimestamp') {
        setShowWarning(false);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Nettoyage
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      clearInterval(intervalCheck);
      window.removeEventListener('storage', handleStorageChange);
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
            localStorage.setItem('lastActivityTimestamp', Date.now().toString());
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