import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Icon, { IconWithText } from '../components/Icons'; // Import de notre système d'icônes
import TutorialOverlay from './TutorialOverlay';

const HomeContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const HeroSection = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: ${props => props.theme.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.text};
  margin-bottom: 1rem;
  font-weight: 300;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.text};
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const ActionCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  text-decoration: none;
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.theme.primary};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const ActionIcon = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: ${props => props.color || props.theme.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
`;

const ActionDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.text};
  opacity: 0.8;
  text-align: center;
  line-height: 1.4;
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${props => props.theme.secondary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  margin: 0.5rem;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.primary};
    transform: translateY(-2px);
  }
`;

const VideoContainer = styled.div`
  margin-top: 3rem;
  margin-bottom: 2rem;
  background-color: ${props => props.theme.card};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h3 {
    margin-bottom: 1rem;
    color: ${props => props.theme.text};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 1.5rem;
  }

  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* Ratio 16:9 */
    height: 0;
    overflow: hidden;
    max-width: 100%;
    border-radius: 8px;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }
  }
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: ${props => props.theme.cardSecondary || props.theme.card};
  border-radius: 8px;
  border-left: 4px solid ${props => props.theme.primary};
`;

const FeatureText = styled.span`
  color: ${props => props.theme.text};
  font-weight: 500;
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
      <HeroSection>
        <Title>
          <Icon name="stethoscope" size="xxl" />
          RIFIM
        </Title>
        <Subtitle>
          Radiologie Interventionnelle - Formation et Innovation Médicale
        </Subtitle>
        <Description>
          Plateforme complète pour la création et la gestion de questionnaires médicaux, 
          l'analyse de cas cliniques et la formation en radiologie interventionnelle.
        </Description>
      </HeroSection>

      {/* Fonctionnalités principales */}
      <FeaturesList>
        <FeatureItem>
          <Icon name="check" size="md" color="#10B981" />
          <FeatureText>Création de questionnaires interactifs</FeatureText>
        </FeatureItem>
        <FeatureItem>
          <Icon name="check" size="md" color="#10B981" />
          <FeatureText>Gestion de cas cliniques avec images</FeatureText>
        </FeatureItem>
        <FeatureItem>
          <Icon name="check" size="md" color="#10B981" />
          <FeatureText>Partage de contenu médical sécurisé</FeatureText>
        </FeatureItem>
        <FeatureItem>
          <Icon name="check" size="md" color="#10B981" />
          <FeatureText>Interface intuitive et moderne</FeatureText>
        </FeatureItem>
      </FeaturesList>

      {/* Actions principales */}
      <ActionsGrid>
        <ActionCard to="/questionnaires">
          <ActionIcon color="#005A9C">
            <Icon name="checklist" size="xl" color="white" />
          </ActionIcon>
          <ActionTitle>Mes Questionnaires</ActionTitle>
          <ActionDescription>
            Créez, modifiez et gérez vos questionnaires médicaux personnalisés. 
            Générez des comptes-rendus automatisés et suivez vos données.
          </ActionDescription>
        </ActionCard>

        <ActionCard to="/cases">
          <ActionIcon color="#006B3C">
            <Icon name="folder" size="xl" color="white" />
          </ActionIcon>
          <ActionTitle>Mes Cas Cliniques</ActionTitle>
          <ActionDescription>
            Organisez vos cas cliniques avec images, annotations et analyses. 
            Créez une bibliothèque de référence pour vos études.
          </ActionDescription>
        </ActionCard>

        <ActionCard to="/public-questionnaires">
          <ActionIcon color="#7C3AED">
            <Icon name="book-open" size="xl" color="white" />
          </ActionIcon>
          <ActionTitle>Questionnaires Publics</ActionTitle>
          <ActionDescription>
            Explorez et utilisez les questionnaires partagés par la communauté médicale. 
            Accédez à une base de connaissances collaborative.
          </ActionDescription>
        </ActionCard>

        <ActionCard to="/public-cases">
          <ActionIcon color="#DC2626">
            <Icon name="folder-open" size="xl" color="white" />
          </ActionIcon>
          <ActionTitle>Cas Publics</ActionTitle>
          <ActionDescription>
            Consultez les cas cliniques publics, apprenez de l'expérience d'autres praticiens 
            et enrichissez vos connaissances.
          </ActionDescription>
        </ActionCard>
      </ActionsGrid>

      {/* Actions secondaires */}
      <div style={{ marginBottom: '2rem' }}>
        <SecondaryButton onClick={() => setShowTutorial(true)}>
          <Icon name="help" size="sm" />
          Tutoriel Interactif
        </SecondaryButton>
        
        <SecondaryButton as={Link} to="/create">
          <Icon name="plus" size="sm" />
          Créer un Nouveau Questionnaire
        </SecondaryButton>
      </div>

      {/* Vidéo tutoriel */}
      <VideoContainer>
        <h3>
          <Icon name="video" size="lg" />
          Tutoriel Vidéo
        </h3>
        <div className="video-wrapper">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/NerjVRmP7TA"
            title="Tutoriel RIFIM - Guide d'utilisation"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </VideoContainer>

      {/* Overlay tutoriel */}
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