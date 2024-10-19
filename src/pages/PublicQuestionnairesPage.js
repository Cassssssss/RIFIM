import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { Link } from 'react-router-dom';

const PublicQuestionnairesPage = () => {
  const [questionnaires, setQuestionnaires] = useState([]);

  useEffect(() => {
    const fetchPublicQuestionnaires = async () => {
        try {
          const response = await axios.get('/questionnaires/public');
          setQuestionnaires(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des questionnaires publics:', error);
        }
      };

    fetchPublicQuestionnaires();
  }, []);

  return (
    <div>
      <h1>Questionnaires Publics</h1>
      {questionnaires.map(questionnaire => (
        <div key={questionnaire._id}>
          <h2>{questionnaire.title}</h2>
          <Link to={`/use/${questionnaire._id}`}>Utiliser ce questionnaire</Link>
        </div>
      ))}
    </div>
  );
};

export default PublicQuestionnairesPage;