import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
// import TutorialOverlay from '../components/TutorialOverlay'; // Commenté temporairement

const HomeContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.primary};
  margin-bottom: 1rem;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.text};
  margin-bottom: 2rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.text};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Button = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin-right: 1rem;
  margin-bottom: 1rem;

  &:hover {
    background-color: ${props => props.theme.secondary};
  }
`;

const TutorialButton = styled.button`
  display: inline-block;
  background-color: ${props => props.theme.secondary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin-right: 1rem;
  margin-bottom: 1rem;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.primary};
  }
`;

const VideoContainer = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
`;

function Home() {
  const [showTutorial, setShowTutorial] = useState(false);

  const tutorialSteps = [
    {
      image: '/tutorials/Screen_Home_1.png',
      description: 'C\'est la page d\'accueil de RIFIM. Ici, tu peux accéder à tes questionnaires (comptes rendus), tes cas, ou les questionnaires (CR) et cas publics en cliquant sur <strong>chacun des 4 boutons</strong> en bas de la page. En appuyant sur l\'acronyme RIFIM en haut à gauche depuis n\'importe quelle page, tu reviens à cette page d\'accueil.'
    }
  ];

  return (
    <HomeContainer>
      <Title>🩺 RIFIM</Title>
      <Subtitle>Radiologie Interventionnelle - Formation et Innovation Médicale</Subtitle>
      <Description>
        Bienvenue sur RIFIM, votre plateforme dédiée à la radiologie interventionnelle. 
        Créez des questionnaires, gérez vos cas cliniques et accédez à une bibliothèque de ressources partagées.
      </Description>
      
      <ButtonContainer>
        <Button to="/questionnaires">📋 Mes Questionnaires</Button>
        <Button to="/cases">📁 Mes Cas</Button>
        <Button to="/public-questionnaires">📖 Questionnaires Publics</Button>
        <Button to="/public-cases">📂 Cas Publics</Button>
      </ButtonContainer>

      <div style={{ marginTop: '2rem' }}>
        <TutorialButton onClick={() => alert('Tutoriel temporairement désactivé')}>
          ❓ Voir le Tutoriel
        </TutorialButton>
      </div>

      <VideoContainer>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/NerjVRmP7TA"
          title="Tutoriel RIFIM"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </VideoContainer>

      {/* Tutoriel temporairement désactivé
      {showTutorial && (
        <TutorialOverlay 
          steps={tutorialSteps} 
          onClose={() => setShowTutorial(false)} 
        />
      )}
      */}
    </HomeContainer>
  );
}

export default Home;