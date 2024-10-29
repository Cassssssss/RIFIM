// Dans src/components/LinkView.js, mettez à jour le composant :

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import styled from 'styled-components';

const ViewerContainer = styled.div`
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  background-color: ${props => props.theme.background};
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const Content = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  
  img {
    max-width: 100%;
    height: auto;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const LinkView = () => {
  const { questionnaireId, elementId, linkIndex } = useParams();
  const [linkContent, setLinkContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinkContent = async () => {
      try {
        const response = await axios.get(`/questionnaires/${questionnaireId}/links/${elementId}`);
        if (response.data && response.data.links && response.data.links[linkIndex]) {
          setLinkContent(response.data.links[linkIndex]);
        } else {
          setError('Lien non trouvé');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du lien:', error);
        setError('Erreur lors du chargement du contenu');
      } finally {
        setLoading(false);
      }
    };

    fetchLinkContent();
  }, [questionnaireId, elementId, linkIndex]);

  if (loading) {
    return (
      <ViewerContainer>
        <div>Chargement...</div>
      </ViewerContainer>
    );
  }

  if (error) {
    return (
      <ViewerContainer>
        <div>Erreur: {error}</div>
      </ViewerContainer>
    );
  }

  return (
    <ViewerContainer>
      {linkContent && (
        <>
          <Title>{linkContent.title || 'Fiche'}</Title>
          <Content dangerouslySetInnerHTML={{ __html: linkContent.content }} />
        </>
      )}
    </ViewerContainer>
  );
};

export default LinkView;