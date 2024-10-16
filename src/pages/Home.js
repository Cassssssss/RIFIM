import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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

  &:hover {
    background-color: ${props => props.theme.secondary};
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

function Home() {
  return (
    <HomeContainer>
      <Title>Bienvenue sur RIFIM</Title>
      <Subtitle>Votre outil de gestion de questionnaires radiologiques</Subtitle>
      <Description>
        RIFIM est une plateforme conçue pour les professionnels de la radiologie. 

        Elle permet de créer, gérer et utiliser des questionnaires personnalisés pour améliorer la qualité des examens 
        et le suivi des patients. Avec notre outil, vous pouvez facilement structurer vos rapports, 
        standardiser vos procédures et optimiser votre flux de travail.
        
        Elle comprends également une base de données de cas de radiologie pour vous entraîner et vous perfectionner.
      </Description>
      <VideoContainer>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/VOTRE_ID_VIDEO"
          title="Vidéo explicative RIFIM"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </VideoContainer>
      <Button to="/questionnaires">Voir les questionnaires</Button>
      <Button to="/cases-list">Visualiser les cas de radiologie</Button>
    </HomeContainer>
  );
}

export default Home;