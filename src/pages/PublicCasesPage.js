import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { Link } from 'react-router-dom';

const PublicCasesPage = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchPublicCases = async () => {
      try {
        const response = await axios.get('/api/cases/public');
        setCases(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des cas publics:', error);
      }
    };

    fetchPublicCases();
  }, []);

  return (
    <div>
      <h1>Cas Publics</h1>
      {cases.map(caseItem => (
        <div key={caseItem._id}>
          <h2>{caseItem.title}</h2>
          <Link to={`/radiology-viewer/${caseItem._id}`}>Voir ce cas</Link>
        </div>
      ))}
    </div>
  );
};

export default PublicCasesPage;