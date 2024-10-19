import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../utils/axiosConfig';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles'; // Assurez-vous q

const PageContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.background};
  min-height: calc(100vh - 60px);
  padding: 2rem;
`;

const FilterSection = styled.div`
  width: 250px;
  margin-right: 2rem;
  background-color: ${props => props.theme.card};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterTitle = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: ${props => props.theme.primary};
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  cursor: pointer;

  input {
    margin-right: 0.5rem;
  }
`;

const FilterIndicator = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${props => props.theme.primary};
  padding: 0.5rem;
  background-color: ${props => props.theme.background};
  border-radius: 4px;
`;

const ListContainer = styled.div`
  flex-grow: 1;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  font-size: 1rem;
`;

const QuestionnaireItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.border};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.hover};
  }
`;

const QuestionnaireTitle = styled.span`
  color: ${props => props.theme.text};
  font-size: 1.1rem;
  font-weight: 500;
`;

const ActionButton = styled(Link)`
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.buttonText};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    background-color: ${props => props.theme.secondary};
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
`;

function QuestionnairePage() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilters, setModalityFilters] = useState([]);
  const [specialtyFilters, setSpecialtyFilters] = useState([]);

  const fetchQuestionnaires = useCallback(async (page = 1) => {
    try {
      const response = await axios.get('/questionnaires', {
        params: {
          page,
          limit: 10,
          search: searchTerm,
          modality: modalityFilters.join(','),
          specialty: specialtyFilters.join(',')
        }
      });
      if (response.data && response.data.questionnaires) {
        setQuestionnaires(response.data.questionnaires);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      } else {
        setQuestionnaires([]);
        setCurrentPage(1);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des questionnaires:', error);
      setQuestionnaires([]);
      setCurrentPage(1);
      setTotalPages(0);
    }
  }, [searchTerm, modalityFilters, specialtyFilters]);

  useEffect(() => {
    fetchQuestionnaires(1);
    const headerTitle = document.getElementById('header-title');
    if (headerTitle) {
      headerTitle.textContent = 'Liste des questionnaires';
    }
  }, [fetchQuestionnaires]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleModalityFilter = (modality) => {
    setModalityFilters(prev => {
      if (prev.includes(modality)) {
        return prev.filter(m => m !== modality);
      } else {
        return [...prev, modality];
      }
    });
  };

  const handleSpecialtyFilter = (specialty) => {
    setSpecialtyFilters(prev => {
      if (prev.includes(specialty)) {
        return prev.filter(s => s !== specialty);
      } else {
        return [...prev, specialty];
      }
    });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchQuestionnaires(1);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, modalityFilters, specialtyFilters, fetchQuestionnaires]);

  return (
    <PageContainer>
      <FilterSection>
        <FilterGroup>
          <FilterTitle>Modalités</FilterTitle>
          {['Rx', 'TDM', 'IRM', 'Echo'].map(modality => (
            <FilterOption key={modality}>
              <input
                type="checkbox"
                name="modality"
                value={modality}
                checked={modalityFilters.includes(modality)}
                onChange={() => handleModalityFilter(modality)}
              />
              {modality}
            </FilterOption>
          ))}
        </FilterGroup>
        <FilterGroup>
          <FilterTitle>Spécialités</FilterTitle>
          {['Neuro', 'Thorax', 'Ostéo', 'Dig', 'Cardiovasc', 'Séno', 'Uro', 'ORL', 'Pelvis', 'Pedia'].map(specialty => (
            <FilterOption key={specialty}>
              <input
                type="checkbox"
                name="specialty"
                value={specialty}
                checked={specialtyFilters.includes(specialty)}
                onChange={() => handleSpecialtyFilter(specialty)}
              />
              {specialty}
            </FilterOption>
          ))}
        </FilterGroup>
        {(modalityFilters.length > 0 || specialtyFilters.length > 0) && (
          <FilterIndicator>
            Filtres appliqués : 
            {modalityFilters.concat(specialtyFilters).join(', ')}
          </FilterIndicator>
        )}
      </FilterSection>
      <ListContainer>
        <SearchBar
          type="text"
          placeholder="Rechercher un questionnaire..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <ul>
          {questionnaires.map((questionnaire) => (
            <QuestionnaireItem key={questionnaire._id}>
              <div>
                <QuestionnaireTitle>{questionnaire.title}</QuestionnaireTitle>
                <TagsContainer>
                  {questionnaire.tags && questionnaire.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagsContainer>
              </div>
              <ActionButton to={`/use/${questionnaire._id}`}>UTILISER</ActionButton>
            </QuestionnaireItem>
          ))}
        </ul>
        <PaginationContainer>
          <PaginationButton onClick={() => fetchQuestionnaires(currentPage - 1)} disabled={currentPage === 1}>
            Précédent
          </PaginationButton>
          <PaginationInfo>Page {currentPage} sur {totalPages}</PaginationInfo>
          <PaginationButton onClick={() => fetchQuestionnaires(currentPage + 1)} disabled={currentPage === totalPages}>
            Suivant
          </PaginationButton>
        </PaginationContainer>
      </ListContainer>
    </PageContainer>
  );
}

export default QuestionnairePage;