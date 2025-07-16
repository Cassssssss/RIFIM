// pages/QuestionnairePage.js - VERSION COMPLÈTE AVEC BOUTON SUPPRIMER PLUS PETIT
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../utils/axiosConfig';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

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

const FilterDropdown = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background-color: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1;
`;

const DropdownOption = styled.label`
  display: block;
  padding: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.hover};
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

const QuestionnaireTitle = styled(Link)`
  color: ${props => props.theme.text};
  font-size: 1.1rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
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

// ========== NOUVEAU STYLED COMPONENT POUR LE BOUTON SUPPRIMER PLUS PETIT ==========
const DeleteButton = styled.button`
  background-color: #ef4444;
  color: white;
  padding: 0.25rem 0.5rem; // Plus petit padding
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.75rem; // Plus petite taille de police
  display: flex;
  align-items: center;
  gap: 0.25rem; // Plus petit gap
  transition: all 0.2s ease;

  &:hover {
    background-color: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  }

  svg {
    width: 12px; // Plus petite icône
    height: 12px;
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
  const [locationFilters, setLocationFilters] = useState([]);
  const [isModalityDropdownOpen, setIsModalityDropdownOpen] = useState(false);
  const [isSpecialtyDropdownOpen, setIsSpecialtyDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const modalityOptions = ['Rx', 'TDM', 'IRM', 'Echo'];
  const specialtyOptions = ['Cardiovasc', 'Dig', 'Neuro', 'ORL', 'Ostéo', 'Pedia', 'Pelvis', 'Séno', 'Thorax', 'Uro'];
  const locationOptions = [
    "Avant-pied", "Bras", "Bassin", "Cheville", "Coude", "Cuisse", "Doigts", "Epaule", 
    "Genou", "Hanche", "Jambe", "Parties molles", "Poignet", "Rachis"
  ];

  const fetchQuestionnaires = useCallback(async (page = 1) => {
    try {
      const response = await axios.get('/questionnaires', {
        params: {
          page,
          limit: 10,
          search: searchTerm,
          modality: modalityFilters.join(','),
          specialty: specialtyFilters.join(','),
          location: locationFilters.join(',')
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
  }, [searchTerm, modalityFilters, specialtyFilters, locationFilters]);

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

  const handleLocationFilter = (location) => {
    setLocationFilters(prev => {
      if (prev.includes(location)) {
        return prev.filter(l => l !== location);
      } else {
        return [...prev, location];
      }
    });
  };

  // ========== FONCTION DE SUPPRESSION ==========
  const deleteQuestionnaire = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce questionnaire ?')) {
      try {
        await axios.delete(`/questionnaires/${id}`);
        fetchQuestionnaires(currentPage);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du questionnaire');
      }
    }
  };

  return (
    <PageContainer>
      <FilterSection>
        <FilterGroup>
          <FilterTitle>📊 Modalités</FilterTitle>
          <FilterDropdown>
            <DropdownButton onClick={() => setIsModalityDropdownOpen(!isModalityDropdownOpen)}>
              Modalités
              {isModalityDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </DropdownButton>
            {isModalityDropdownOpen && (
              <DropdownContent>
                {modalityOptions.map(modality => (
                  <DropdownOption key={modality}>
                    <input
                      type="checkbox"
                      name="modality"
                      value={modality}
                      checked={modalityFilters.includes(modality)}
                      onChange={() => handleModalityFilter(modality)}
                    />
                    {modality}
                  </DropdownOption>
                ))}
              </DropdownContent>
            )}
          </FilterDropdown>
        </FilterGroup>

        <FilterGroup>
          <FilterTitle>🏥 Spécialités</FilterTitle>
          <FilterDropdown>
            <DropdownButton onClick={() => setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen)}>
              Spécialités
              {isSpecialtyDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </DropdownButton>
            {isSpecialtyDropdownOpen && (
              <DropdownContent>
                {specialtyOptions.map(specialty => (
                  <DropdownOption key={specialty}>
                    <input
                      type="checkbox"
                      name="specialty"
                      value={specialty}
                      checked={specialtyFilters.includes(specialty)}
                      onChange={() => handleSpecialtyFilter(specialty)}
                    />
                    {specialty}
                  </DropdownOption>
                ))}
              </DropdownContent>
            )}
          </FilterDropdown>
        </FilterGroup>

        <FilterGroup>
          <FilterTitle>📍 Localisation</FilterTitle>
          <FilterDropdown>
            <DropdownButton onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}>
              Localisation
              {isLocationDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </DropdownButton>
            {isLocationDropdownOpen && (
              <DropdownContent>
                {locationOptions.map(location => (
                  <DropdownOption key={location}>
                    <input
                      type="checkbox"
                      name="location"
                      value={location}
                      checked={locationFilters.includes(location)}
                      onChange={() => handleLocationFilter(location)}
                    />
                    {location}
                  </DropdownOption>
                ))}
              </DropdownContent>
            )}
          </FilterDropdown>
        </FilterGroup>
        {(modalityFilters.length > 0 || specialtyFilters.length > 0 || locationFilters.length > 0) && (
          <FilterIndicator>
            Filtres appliqués : 
            {[...modalityFilters, ...specialtyFilters, ...locationFilters].join(', ')}
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
                <QuestionnaireTitle to={`/use/${questionnaire._id}`}>
                  {questionnaire.title}
                </QuestionnaireTitle>
                <TagsContainer>
                  {questionnaire.tags && questionnaire.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagsContainer>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <ActionButton to={`/use/${questionnaire._id}`}>UTILISER</ActionButton>
                
                {/* ========== BOUTON SUPPRIMER PLUS PETIT ========== */}
                <DeleteButton onClick={() => deleteQuestionnaire(questionnaire._id)}>
                  <Trash2 />
                  SUPPRIMER
                </DeleteButton>
              </div>
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