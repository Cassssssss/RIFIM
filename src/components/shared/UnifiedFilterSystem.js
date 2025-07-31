// components/shared/UnifiedFilterSystem.js - COMPOSANT DE FILTRES AVEC PORTAL
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';

// ==================== STYLES ROBUSTES ====================

const FilterSystemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  position: relative;
  z-index: 1;
  overflow: visible;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }
`;

const FilterWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 1;
  overflow: visible;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 0.8rem;
  background-color: ${props => props.active ? props.theme.primary : props.theme.backgroundSecondary};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: 2px solid ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 100px;
  max-width: 150px;
  justify-content: space-between;
  position: relative;
  z-index: 1;

  &:hover {
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.active ? props.theme.primaryDark : props.theme.card};
  }

  &.open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-color: transparent;
    background-color: ${props => props.theme.card};
    color: ${props => props.theme.text};
  }

  svg {
    transition: transform 0.2s ease;
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  &.open svg {
    transform: rotate(180deg);
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: auto;
    max-width: none;
  }
`;

const DropdownOption = styled.label`
  display: flex;
  align-items: center;
  padding: 0.4rem 0.7rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid ${props => props.theme.borderLight};
  color: ${props => props.theme.text};
  font-weight: 400;
  font-size: 0.8rem;
  user-select: none;
  white-space: nowrap;

  &:hover {
    background-color: ${props => props.theme.hover};
  }

  &:last-child {
    border-bottom: none;
  }

  input[type="checkbox"] {
    margin-right: 0.5rem;
    width: 12px;
    height: 12px;
    cursor: pointer;
    flex-shrink: 0;
    accent-color: ${props => props.theme.primary};
    
    /* CRITIQUE : Forcer l'apparence native des checkboxes */
    -webkit-appearance: checkbox;
    -moz-appearance: checkbox;
    appearance: checkbox;
    
    /* CRITIQUE : S'assurer que la checkbox est visible */
    opacity: 1;
    position: relative;
    z-index: 1;
  }

  span {
    color: ${props => props.theme.text};
    flex: 1;
    line-height: 1.2;
    font-size: 0.8rem;
  }
`;

const SpoilerButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 0.8rem;
  background-color: ${props => props.active ? props.theme.secondary : props.theme.backgroundSecondary};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: 2px solid ${props => props.active ? props.theme.secondary : props.theme.border};
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: ${props => props.theme.secondary};
    background-color: ${props => props.active ? props.theme.secondaryDark : props.theme.card};
  }

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
  }
`;

// ==================== PORTAL STYLES ====================

const PortalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 2147483646;
  
  @media (max-width: 768px) {
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const PortalDropdownContainer = styled.div`
  position: fixed;
  background-color: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.primary};
  border-radius: 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-height: 250px;
  overflow-y: auto;
  min-width: 200px;
  max-width: 300px;
  width: max-content;
  z-index: 2147483647;

  animation: dropdownAppear 0.15s ease-out;

  @keyframes dropdownAppear {
    from {
      opacity: 0;
      transform: scale(0.98);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 768px) {
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    max-height: 60vh;
    max-width: 90vw;
    min-width: 250px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
  }
`;

// ==================== HOOK PERSONNALISÉ POUR LA GESTION DES CLICS ====================

const useClickOutside = (refs, callback) => {
  useEffect(() => {
    const handleClick = (event) => {
      // CRITIQUE : Ne pas fermer si le clic est sur une checkbox ou dans le dropdown
      const isInsideDropdown = event.target.closest('[data-dropdown-content]');
      const isCheckbox = event.target.type === 'checkbox';
      
      if (isInsideDropdown || isCheckbox) {
        return;
      }

      const isOutside = refs.every(ref => 
        ref.current && !ref.current.contains(event.target)
      );
      
      if (isOutside) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick, true);
    document.addEventListener('touchstart', handleClick, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClick, true);
      document.removeEventListener('touchstart', handleClick, true);
    };
  }, [refs, callback]);
};

// ==================== COMPOSANT PORTAL POUR DROPDOWN ====================

function DropdownPortal({ 
  isOpen, 
  onClose, 
  buttonRef, 
  options, 
  selectedValues, 
  onChange 
}) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        setPosition({
          top: window.innerHeight / 2,
          left: window.innerWidth / 2
        });
      } else {
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX
        });
      }
    }
  }, [isOpen, buttonRef]);

  const handleOptionChange = useCallback((option, event) => {
    // CRITIQUE : Empêcher la propagation pour ne pas fermer le dropdown
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(val => val !== option)
      : [...selectedValues, option];
    
    // CRITIQUE : Appliquer immédiatement le changement
    console.log('Changement filtre:', option, 'nouvelles valeurs:', newValues);
    onChange(newValues);
  }, [selectedValues, onChange]);

  if (!isOpen) return null;

  const portalContent = (
    <>
      <PortalOverlay onClick={onClose} />
      <PortalDropdownContainer
        style={{
          top: position.top,
          left: position.left
        }}
        onClick={(e) => {
          // CRITIQUE : Empêcher la fermeture quand on clique dans le dropdown
          e.stopPropagation();
        }}
        data-dropdown-content="true"
      >
        {options.map(option => {
          const isChecked = selectedValues.includes(option);
          
          return (
            <DropdownOption 
              key={option}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOptionChange(option, e);
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => {
                  e.stopPropagation();
                  handleOptionChange(option, e);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
              <span>{option}</span>
            </DropdownOption>
          );
        })}
      </PortalDropdownContainer>
    </>
  );

  return ReactDOM.createPortal(portalContent, document.body);
}

// ==================== COMPOSANT FILTRE INDIVIDUEL ====================

function FilterDropdown({ 
  title, 
  options, 
  selectedValues, 
  onChange, 
  icon = '🔧',
  isOpen,
  onToggle,
  filterRef
}) {
  return (
    <FilterWrapper ref={filterRef}>
      <FilterButton
        className={isOpen ? 'open' : ''}
        active={selectedValues.length > 0}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <span>
          {icon} {title} {selectedValues.length > 0 && `(${selectedValues.length})`}
        </span>
        <ChevronDown />
      </FilterButton>
      
      <DropdownPortal
        isOpen={isOpen}
        onClose={onToggle}
        buttonRef={filterRef}
        options={options}
        selectedValues={selectedValues}
        onChange={onChange}
      />
    </FilterWrapper>
  );
}

// ==================== COMPOSANT PRINCIPAL UNIFIED FILTER SYSTEM ====================

function UnifiedFilterSystem({ 
  filters = [],
  showSpoilerButton = false,
  spoilerState = false,
  onSpoilerToggle = () => {},
  spoilerLabels = { show: 'Voir titres', hide: 'Masquer titres' },
  className = '',
  style = {}
}) {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const dropdownRefs = useRef({});
  
  useEffect(() => {
    filters.forEach(filter => {
      if (!dropdownRefs.current[filter.key]) {
        dropdownRefs.current[filter.key] = React.createRef();
      }
    });
  }, [filters]);

  const closeAllDropdowns = useCallback(() => {
    setOpenDropdowns({});
  }, []);

  const toggleDropdown = useCallback((filterKey) => {
    setOpenDropdowns(prev => {
      const newState = { ...prev };
      
      Object.keys(newState).forEach(key => {
        if (key !== filterKey) {
          newState[key] = false;
        }
      });
      
      newState[filterKey] = !prev[filterKey];
      
      return newState;
    });
  }, []);

  const refs = Object.values(dropdownRefs.current).filter(ref => ref?.current);
  useClickOutside(refs, closeAllDropdowns);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeAllDropdowns();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeAllDropdowns]);

  return (
    <FilterSystemContainer className={className} style={style}>
      {filters.map(filter => (
        <FilterDropdown
          key={filter.key}
          title={filter.title}
          options={filter.options}
          selectedValues={filter.selectedValues}
          onChange={filter.onChange}
          icon={filter.icon}
          isOpen={openDropdowns[filter.key] || false}
          onToggle={() => toggleDropdown(filter.key)}
          filterRef={dropdownRefs.current[filter.key]}
        />
      ))}
      
      {showSpoilerButton && (
        <SpoilerButton 
          active={spoilerState}
          onClick={onSpoilerToggle}
        >
          {spoilerState ? <EyeOff size={16} /> : <Eye size={16} />}
          {spoilerState ? spoilerLabels.hide : spoilerLabels.show}
        </SpoilerButton>
      )}
    </FilterSystemContainer>
  );
}

export default UnifiedFilterSystem;