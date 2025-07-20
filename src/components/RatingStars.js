import React, { useState } from 'react';
import styled from 'styled-components';
import { Star } from 'lucide-react';
import axios from '../utils/axiosConfig';

// ==================== STYLED COMPONENTS ====================

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1rem 0;
`;

const RatingDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const StarsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.1rem;
`;

const RatingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

const RatingValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 1rem;
`;

const RatingCount = styled.span`
  color: ${props => props.theme.textSecondary};
`;

// NOUVEAU : Système de notation numérique
const NumericRatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background-color: ${props => props.theme.backgroundSecondary || props.theme.card};
  border: 1px solid ${props => props.theme.borderLight};
  border-radius: 8px;
  margin-top: 0.5rem;
`;

const RatingLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const RatingInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RatingSlider = styled.input`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: ${props => props.theme.borderLight};
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.primary};
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.primary};
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const RatingNumber = styled.div`
  min-width: 50px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.primary};
  padding: 0.5rem;
  background: ${props => props.theme.background};
  border: 2px solid ${props => props.theme.primary};
  border-radius: 6px;
`;

const RatingButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

const QuickRatingButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 2px solid ${props => props.isSelected ? props.theme.primary : props.theme.borderLight};
  border-radius: 6px;
  background-color: ${props => props.isSelected ? props.theme.primary : props.theme.background};
  color: ${props => props.isSelected ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.primary};
    background-color: ${props => !props.isSelected ? props.theme.hover : props.theme.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CommentInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.borderLight};
  border-radius: 6px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const RatingActions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
`;

const RatingButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background-color: ${props => props.theme.primary};
    color: white;
    
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.primaryDark || props.theme.primary};
      transform: translateY(-1px);
    }
  }
  
  &.secondary {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    border: 2px solid ${props => props.theme.borderLight};
    
    &:hover:not(:disabled) {
      border-color: ${props => props.theme.primary};
      background-color: ${props => props.theme.hover};
    }
  }
  
  &.danger {
    background-color: #ef4444;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #dc2626;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StartRatingButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.primaryDark || props.theme.primary};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  
  &.success {
    background-color: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  }
  
  &.error {
    background-color: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }
`;

// ==================== COMPOSANT PRINCIPAL ====================

function RatingStars({ 
  itemId,           // MODIFIÉ : au lieu de protocolId
  itemType,         // NOUVEAU : 'protocol', 'case', ou 'questionnaire'
  averageRating = 0, 
  ratingsCount = 0, 
  userRating = null,
  onRatingUpdate,
  readonly = false,
  size = 16,
  compact = false   // NOUVEAU : mode compact pour affichage dans les cartes
}) {
  const [selectedRating, setSelectedRating] = useState(userRating || 0);
  const [comment, setComment] = useState('');
  const [isRating, setIsRating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Notes rapides prédéfinies
  const quickRatings = [0, 2.5, 5, 7.5, 10];
  const quickLabels = ['0 - Très mauvais', '2.5 - Mauvais', '5 - Moyen', '7.5 - Bon', '10 - Excellent'];

  // Fonction pour obtenir l'URL API appropriée selon le type d'item
  const getApiUrl = (action = '') => {
    const baseUrl = `/${itemType}s/${itemId}/rate`;
    return action === 'delete' ? baseUrl : baseUrl;
  };

  // Fonction pour obtenir le nom du type d'item en français
  const getItemTypeFrench = () => {
    switch(itemType) {
      case 'protocol': return 'protocole';
      case 'case': return 'cas';
      case 'questionnaire': return 'questionnaire';
      default: return 'élément';
    }
  };

  const handleStartRating = () => {
    setIsRating(true);
    setSelectedRating(userRating || 0);
  };

  const handleSliderChange = (e) => {
    const value = parseFloat(e.target.value);
    setSelectedRating(value);
  };

  const handleQuickRating = (rating) => {
    setSelectedRating(rating);
  };

  const cancelRating = () => {
    setIsRating(false);
    setSelectedRating(userRating || 0);
    setComment('');
    setMessage('');
  };

  const submitRating = async () => {
    if (selectedRating === null || selectedRating === undefined) {
      setMessage('Veuillez sélectionner une note');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(getApiUrl(), {
        rating: selectedRating,
        comment: comment.trim()
      });

      setMessage('Note ajoutée avec succès !');
      setIsRating(false);
      
      // Appeler le callback de mise à jour si fourni
      if (onRatingUpdate) {
        onRatingUpdate(response.data);
      }

      // Effacer le message après 3 secondes
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Erreur lors de la notation:', error);
      setMessage(error.response?.data?.message || 'Erreur lors de la notation');
    } finally {
      setLoading(false);
    }
  };

  const deleteRating = async () => {
    if (!userRating) return;

    setLoading(true);
    setMessage('');

    try {
      await axios.delete(getApiUrl('delete'));
      
      setSelectedRating(0);
      setComment('');
      setIsRating(false);
      setMessage('Note supprimée avec succès !');
      
      // Appeler le callback de mise à jour si fourni
      if (onRatingUpdate) {
        onRatingUpdate({
          averageRating: 0,
          ratingsCount: 0,
          userRating: null
        });
      }

      // Effacer le message après 3 secondes
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setMessage(error.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  // Affichage des étoiles basé sur la note moyenne
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(averageRating / 2); // Conversion 0-10 vers 0-5
    const hasHalfStar = (averageRating / 2) % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            size={size}
            fill={`${compact ? '#fbbf24' : '#fbbf24'}`}
            stroke="#fbbf24"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            size={size}
            fill="url(#half)"
            stroke="#fbbf24"
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            size={size}
            fill="transparent"
            stroke="#d1d5db"
          />
        );
      }
    }
    return stars;
  };

  if (readonly) {
    return (
      <RatingDisplay>
        <StarsContainer>
          {renderStars()}
        </StarsContainer>
        {!compact && (
          <RatingInfo>
            <RatingValue>{averageRating.toFixed(1)}/10</RatingValue>
            <RatingCount>({ratingsCount} note{ratingsCount > 1 ? 's' : ''})</RatingCount>
          </RatingInfo>
        )}
      </RatingDisplay>
    );
  }

  return (
    <RatingContainer>
      {/* Affichage de la note moyenne */}
      <RatingDisplay>
        <StarsContainer>
          <svg width="0" height="0">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
          {renderStars()}
        </StarsContainer>
        <RatingInfo>
          <RatingValue>{averageRating.toFixed(1)}/10</RatingValue>
          <RatingCount>({ratingsCount} note{ratingsCount > 1 ? 's' : ''})</RatingCount>
        </RatingInfo>
      </RatingDisplay>

      {/* Bouton pour commencer à noter */}
      {!isRating && (
        <StartRatingButton onClick={handleStartRating} disabled={loading}>
          {userRating ? 'Modifier ma note' : `⭐ Noter ce ${getItemTypeFrench()}`}
        </StartRatingButton>
      )}

      {/* Interface de notation */}
      {isRating && (
        <NumericRatingContainer>
          <RatingLabel>
            Notez ce {getItemTypeFrench()} de 0 à 10 (par incréments de 0.5)
          </RatingLabel>
          
          {/* Slider pour la note */}
          <RatingInputContainer>
            <RatingSlider
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={selectedRating}
              onChange={handleSliderChange}
              disabled={loading}
            />
            <RatingNumber>{selectedRating}/10</RatingNumber>
          </RatingInputContainer>

          {/* Boutons de notation rapide */}
          <RatingButtons>
            {quickRatings.map((rating, index) => (
              <QuickRatingButton
                key={rating}
                isSelected={selectedRating === rating}
                onClick={() => handleQuickRating(rating)}
                disabled={loading}
                title={quickLabels[index]}
              >
                {rating}
              </QuickRatingButton>
            ))}
          </RatingButtons>

          {/* Champ de commentaire */}
          <CommentInput
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Commentaire sur ce ${getItemTypeFrench()} (optionnel)...`}
            disabled={loading}
          />
          
          {/* Actions */}
          <RatingActions>
            <RatingButton 
              className="primary" 
              onClick={submitRating}
              disabled={loading}
            >
              {loading ? 'En cours...' : (userRating ? 'Modifier' : 'Publier la note')}
            </RatingButton>
            
            <RatingButton 
              className="secondary" 
              onClick={cancelRating}
              disabled={loading}
            >
              Annuler
            </RatingButton>
            
            {userRating && (
              <RatingButton 
                className="danger" 
                onClick={deleteRating}
                disabled={loading}
                style={{ marginLeft: 'auto' }}
              >
                Supprimer ma note
              </RatingButton>
            )}
          </RatingActions>
        </NumericRatingContainer>
      )}

      {/* Messages */}
      {message && (
        <Message className={message.includes('succès') ? 'success' : 'error'}>
          {message}
        </Message>
      )}
    </RatingContainer>
  );
}

export default RatingStars;