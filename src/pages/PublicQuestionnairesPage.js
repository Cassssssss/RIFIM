import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import styled from 'styled-components';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 1px solid ${props => props.theme.border};
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

const ActionButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.buttonText};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 0.5rem;
  
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



function PublicQuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilters, setModalityFilters] = useState([]);
  const [specialtyFilters, setSpecialtyFilters] = useState([]);
  const [locationFilters, setLocationFilters] = useState([]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const locationOptions = [
    "Avant-pied", "Bras", "Bassin", "Cheville", "Coude", "Cuisse", "Doigts", "Epaule", 
    "Genou", "Hanche", "Jambe", "Parties molles", "Poignet", "Rachis"
  ];

  const fetchQuestionnaires = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/questionnaires/public', {
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
        console.error("Format de réponse inattendu:", response.data);
        setQuestionnaires([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des questionnaires publics:', error);
      setError("Impossible de charger les questionnaires publics. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, modalityFilters, specialtyFilters, locationFilters]);

  useEffect(() => {
    fetchQuestionnaires(1);
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

  const addToMyQuestionnaires = async (questionnaireId) => {
    try {
      await axios.post(`/questionnaires/${questionnaireId}/copy`);
      alert('Questionnaire ajouté à votre collection privée.');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du questionnaire:', error);
      alert('Erreur lors de l\'ajout du questionnaire. Veuillez réessayer.');
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchQuestionnaires(1);
    }, 300);
  
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, modalityFilters, specialtyFilters, locationFilters, fetchQuestionnaires]);

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
          {['Cardiovasc', 'Dig', 'Neuro', 'ORL', 'Ostéo','Pedia', 'Pelvis', 'Séno', 'Thorax', 'Uro'].map(specialty => (
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
        <FilterGroup>
          <FilterTitle>Localisation</FilterTitle>
          <FilterDropdown>
            <DropdownButton onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}>
              Sélectionner {locationFilters.length > 0 && `(${locationFilters.length})`}
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
        {isLoading ? (
          <p>Chargement des questionnaires publics...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
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
  <div>
    {/* Pour PublicQuestionnairesPage */}
    <ActionButton onClick={() => addToMyQuestionnaires(questionnaire._id)}>
      Ajouter à mes questionnaires
    </ActionButton>
    
    {/* Pour QuestionnaireListPage */}
    <ActionButton as={Link} to={`/use/${questionnaire._id}`}>UTILISER</ActionButton>
  </div>
</QuestionnaireItem>
            ))}
          </ul>
        )}
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

export default PublicQuestionnairesPage;