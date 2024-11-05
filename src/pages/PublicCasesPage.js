import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { Star, ChevronDown, Eye, EyeOff } from 'lucide-react';
import styled from 'styled-components';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';

const PageContainer = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.primary};
  text-align: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.text};
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button`
  padding: 0.75rem;
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.buttonText};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 0.75rem;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
`;

const DropdownOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
`;

const CasesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const CaseCard = styled(Link)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  text-decoration: none;
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.card};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CaseImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;

const CaseTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const StarRating = styled.div`
  display: flex;
  justify-content: center;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.buttonText};
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
`;

function CaseCardComponent({ cas, showSpoilers }) {
  if (!cas) return null;

  return (
    <CaseCard to={`/radiology-viewer/${cas._id}`}>
      <CaseImage 
        src={cas.mainImage || '/images/default.jpg'}
        alt={cas.title || 'Cas sans titre'}
        loading="lazy"
      />
      <CaseTitle>{showSpoilers ? (cas.title || 'Sans titre') : '?'}</CaseTitle>
      <StarRating>
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={20}
            fill={index < (cas.difficulty || 0) ? "gold" : "gray"}
            stroke={index < (cas.difficulty || 0) ? "gold" : "gray"}
          />
        ))}
      </StarRating>
      <TagsContainer>
        {cas.tags && cas.tags.map(tag => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </TagsContainer>
    </CaseCard>
  );
}

function PublicCasesPage() {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState([1,2,3,4,5]);
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [tagFilter, setTagFilter] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(0);

const fetchCases = useCallback(async (page = 1) => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await axios.get(`/cases/public?page=${page}&limit=10`);
    if (response.data) {
      setCases(response.data.cases);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des cas publics:', error);
    setError("Impossible de charger les cas publics. Veuillez réessayer plus tard.");
  } finally {
    setIsLoading(false);
  }
}, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const filteredCases = cases.filter(cas => 
    cas.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    difficultyFilter.includes(cas.difficulty) &&
    (tagFilter.length === 0 || tagFilter.some(tag => cas.tags && cas.tags.includes(tag)))
  );

  const handleDifficultyChange = (difficulty) => {
    setDifficultyFilter(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const handleTagChange = (tag) => {
    setTagFilter(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <PageContainer>
      <Title>Cas Publics</Title>
      
      <SearchInput
        type="text"
        placeholder="Rechercher un cas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <FilterContainer>
        <div style={{ position: 'relative' }}>
          <FilterButton onClick={() => setShowDifficultyDropdown(!showDifficultyDropdown)}>
            Difficulté <ChevronDown size={16} />
          </FilterButton>
          {showDifficultyDropdown && (
            <Dropdown>
              {[1,2,3,4,5].map(difficulty => (
                <DropdownOption key={difficulty}>
                  <input 
                    type="checkbox"
                    checked={difficultyFilter.includes(difficulty)}
                    onChange={() => handleDifficultyChange(difficulty)}
                  />
                  {difficulty} étoile{difficulty > 1 ? 's' : ''}
                </DropdownOption>
              ))}
            </Dropdown>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <FilterButton onClick={() => setShowTagDropdown(!showTagDropdown)}>
            Tags <ChevronDown size={16} />
          </FilterButton>
          {showTagDropdown && (
            <Dropdown>
              {allTags.map(tag => (
                <DropdownOption key={tag}>
                  <input 
                    type="checkbox"
                    checked={tagFilter.includes(tag)}
                    onChange={() => handleTagChange(tag)}
                  />
                  {tag}
                </DropdownOption>
              ))}
            </Dropdown>
          )}
        </div>

        <FilterButton onClick={() => setShowSpoilers(!showSpoilers)}>
          {showSpoilers ? <EyeOff size={16} /> : <Eye size={16} />}
          Spoiler
        </FilterButton>
      </FilterContainer>

      {isLoading ? (
        <p>Chargement des cas publics...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <CasesList>
          {filteredCases.map((cas) => (
            <CaseCardComponent key={cas._id} cas={cas} showSpoilers={showSpoilers} />
          ))}
        </CasesList>
      )}
        <PaginationContainer>
      <PaginationButton 
        onClick={() => fetchCases(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        Précédent
      </PaginationButton>
      <PaginationInfo>Page {currentPage} sur {totalPages}</PaginationInfo>
      <PaginationButton 
        onClick={() => fetchCases(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        Suivant
      </PaginationButton>
    </PaginationContainer>
    </PageContainer>
  );
}

export default PublicCasesPage;