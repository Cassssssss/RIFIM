import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import TutorialOverlay from './TutorialOverlay'; // Assurez-vous que le chemin est correct

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
      image: '/tutorials/Screen_Home.png',
      description: 'Bienvenue sur la page d\'accueil de RIFIM. Ici, vous pouvez accéder à toutes les fonctionnalités principales de l\'application.'
    },
    {
      image: '/tutorials/questionnaires-button.png',
      description: 'Cliquez sur "Voir mes questionnaires" pour accéder à votre liste de questionnaires personnels.'
    },
    {
      image: '/tutorials/cases-button.png',
      description: 'Le bouton "Visualiser mes cas de radiologie" vous permet d\'accéder à vos cas personnels.'
    },
    {
      image: '/tutorials/public-questionnaires-button.png',
      description: 'Découvrez les questionnaires partagés par la communauté en cliquant sur "Voir les questionnaires communs".'
    },
    {
      image: '/tutorials/public-cases-button.png',
      description: 'Explorez les cas de radiologie partagés en cliquant sur "Voir les cas communs".'
    }
  ];

  return (
    <HomeContainer>
      <Title>Bienvenue sur RIFIM</Title>
      <Subtitle>Votre outil de gestion de questionnaires radiologiques</Subtitle>
      <Description>
        RIFIM est une plateforme conçue pour les professionnels de la radiologie. 

        Elle permet de créer, gérer et utiliser des questionnaires personnalisés pour améliorer la qualité des examens 
        et le suivi des patients. Avec notre outil, vous pouvez facilement structurer vos rapports, 
        standardiser vos procédures et optimiser votre flux de travail.

        Elle comprend également une base de données de cas de radiologie pour vous entraîner et vous perfectionner.
      </Description>
      <VideoContainer>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          title="Vidéo explicative RIFIM"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </VideoContainer>
      <ButtonContainer>
        <Button to="/questionnaires-list">Voir mes questionnaires</Button>
        <Button to="/cases-list">Visualiser mes cas de radiologie</Button>
        <Button to="/public-questionnaires">Voir les questionnaires communs</Button>
        <Button to="/public-cases">Voir les cas communs</Button>
        <TutorialButton onClick={() => setShowTutorial(true)}>Voir le tutoriel</TutorialButton>
      </ButtonContainer>
      {showTutorial && (
        <TutorialOverlay 
          steps={tutorialSteps} 
          onClose={() => setShowTutorial(false)} 
        />
      )}
    </HomeContainer>
  );
}

export default Home;