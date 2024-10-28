import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import styled from 'styled-components';

const ViewerContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
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

const LinkView = () => {
  const { questionnaireId, elementId } = useParams();
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`/questionnaires/links/${elementId}`);
        if (response.data && response.data.links) {
          const link = response.data.links.find(l => l.content);
          if (link) {
            setContent(link.content);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du contenu:', error);
      }
    };

    if (elementId) {
      fetchContent();
    }
  }, [elementId, questionnaireId]);

  return (
    <ViewerContainer>
      <Content dangerouslySetInnerHTML={{ __html: content }} />
    </ViewerContainer>
  );
};

export default LinkView;