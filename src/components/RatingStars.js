import React, { useState } from 'react';
import styled from 'styled-components';
import { Star } from 'lucide-react';
import axios from '../utils/axiosConfig';

// ==================== STYLED COMPONENTS ====================

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.compact ? '0.5rem' : '0.75rem'};
  margin: ${props => props.compact ? '0' : '1rem 0'};
`;

const RatingDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.compact ? 'space-between' : 'flex-start'};
  gap: ${props => props.compact ? '0.5rem' : '0.5rem'};
  margin-bottom: ${props => props.compact ? '0' : '0.5rem'};
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
  font-size: ${props => props.compact ? '0.8rem' : '0.875rem'};
`;

const RatingValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: ${props => props.compact ? '0.875rem' : '1rem'};
`;

const RatingCount = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: ${props => props.compact ? '0.75rem' : '0.875rem'};
  white-space: nowrap;
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
  font-weight: 500;
  font-size: 0.9rem;

  &:hover {
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.theme.primary};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CommentInput = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.borderLight};
  border-radius: 6px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const RatingActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
`;

const RatingButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
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
    background-color: ${props => props.theme.textSecondary};
    color: white;

    &:hover:not(:disabled) {
      opacity: 0.8;
    }
  }

  &.danger {
    background-color: ${props => props.theme.error || '#ef4444'};
    color: white;

    &:hover:not(:disabled) {
      opacity: 0.8;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-top: 0.75rem;
  font-weight: 500;

  &.success {
    background-color: ${props => props.theme.success}20;
    color: ${props => props.theme.success};
    border: 1px solid ${props => props.theme.success}30;
  }

  &.error {
    background-color: ${props => props.theme.error}20;
    color: ${props => props.theme.error};
    border: 1px solid ${props => props.theme.error}30;
  }
`;

// MODIFICATION : Bouton plus compact avec taille adaptative
const StartRatingButton = styled.button`
  padding: ${props => props.compact ? '0.3rem 0.6rem' : '0.5rem 1rem'};
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  color: white;
  border: none;
  border-radius: ${props => props.compact ? '4px' : '6px'};
  cursor: pointer;
  font-size: ${props => props.compact ? '0.75rem' : '0.875rem'};
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  max-width: ${props => props.compact ? '120px' : 'none'};
  flex-shrink: 0;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px ${props => props.theme.primary}30;
  }
`;

// NOUVEAU : Conteneur pour l'affichage utilisateur en mode compact
const UserRatingDisplay = styled.div`
  font-size: ${props => props.compact ? '0.75rem' : '0.875rem'};
  color: ${props => props.theme.primary};
  font-weight: 500;
  white-space: nowrap;
`;

// ==================== COMPOSANT PRINCIPAL ====================

function RatingStars({ 
  itemId,           // MODIFICATION : itemId au lieu de protocolId 
  itemType,         // NOUVEAU : type d'élément (protocol, questionnaire, case)
  averageRating = 0, 
  ratingsCount = 0, 
  userRating = null,
  onRatingUpdate,
  readonly = false,
  size = 16,
  compact = false
}) {
  const [selectedRating, setSelectedRating] = useState(userRating || 0);
  const [comment, setComment] = useState('');
  const [isRating, setIsRating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Notes rapides prédéfinies
  const quickRatings = [0, 2.5, 5, 7.5, 10];
  const quickLabels = ['0 - Très mauvais', '2.5 - Mauvais', '5 - Moyen', '7.5 - Bon', '10 - Excellent'];

  // NOUVEAU : Définir les endpoints selon le type d'élément
  const getEndpoints = () => {
    switch (itemType) {
      case 'protocol':
        return {
          rate: `/protocols/${itemId}/rate`,
          delete: `/protocols/${itemId}/rate`
        };
      case 'questionnaire':
        return {
          rate: `/questionnaires/${itemId}/rate`,
          delete: `/questionnaires/${itemId}/rate`
        };
      case 'case':
        return {
          rate: `/cases/${itemId}/rate`,
          delete: `/cases/${itemId}/rate`
        };
      default:
        throw new Error(`Type d'élément non supporté: ${itemType}`);
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

  const submitRating = async () => {
    if (selectedRating === null || selectedRating === undefined) {
      setMessage('Veuillez sélectionner une note');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const endpoints = getEndpoints();
      const response = await axios.post(endpoints.rate, {
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
      const endpoints = getEndpoints();
      await axios.delete(endpoints.delete);
      
      setSelectedRating(0);
      setComment('');
      setIsRating(false);
      setMessage('Note supprimée avec succès !');
      
      if (onRatingUpdate) {
        onRatingUpdate({ averageRating: 0, ratingsCount: 0, userRating: null });
      }

      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setMessage(error.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const cancelRating = () => {
    setSelectedRating(userRating || 0);
    setComment('');
    setIsRating(false);
    setMessage('');
  };

  // Fonction pour afficher les étoiles (en lecture seule)
  const renderDisplayStars = () => {
    const stars = [];
    const displayRating = averageRating / 2; // Convertir 0-10 vers 0-5
    
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= displayRating;
      const isHalfFilled = i === Math.ceil(displayRating) && displayRating % 1 >= 0.5 && !isFilled;

      stars.push(
        <Star
          key={i}
          size={size}
          fill={isFilled ? "gold" : "none"}
          stroke={isFilled ? "gold" : "#d1d5db"}
          style={{ 
            opacity: isHalfFilled ? 0.5 : 1,
            filter: isFilled ? 'drop-shadow(0 1px 2px rgba(255, 215, 0, 0.3))' : 'none'
          }}
        />
      );
    }
    
    return stars;
  };

  // NOUVEAU : Obtenir le texte du bouton selon le type d'élément
  const getButtonText = () => {
    const labels = {
      protocol: compact ? (userRating ? '✏️' : '⭐') : (userRating ? 'Modifier ma note' : '⭐ Noter ce protocole'),
      questionnaire: compact ? (userRating ? '✏️' : '⭐') : (userRating ? 'Modifier ma note' : '⭐ Noter ce questionnaire'),
      case: compact ? (userRating ? '✏️' : '⭐') : (userRating ? 'Modifier ma note' : '⭐ Noter ce cas')
    };
    return labels[itemType] || labels.protocol;
  };

  // NOUVEAU : Obtenir le placeholder du commentaire selon le type
  const getCommentPlaceholder = () => {
    const placeholders = {
      protocol: 'Commentaire sur ce protocole (optionnel)...',
      questionnaire: 'Commentaire sur ce questionnaire (optionnel)...',
      case: 'Commentaire sur ce cas (optionnel)...'
    };
    return placeholders[itemType] || placeholders.protocol;
  };

  return (
    <RatingContainer compact={compact}>
      {/* Affichage de la note moyenne */}
      <RatingDisplay compact={compact}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StarsContainer>
            {renderDisplayStars()}
          </StarsContainer>
          <RatingInfo compact={compact}>
            {averageRating > 0 ? (
              <>
                <RatingValue compact={compact}>{averageRating.toFixed(1)}/10</RatingValue>
                <RatingCount compact={compact}>({ratingsCount} avis)</RatingCount>
              </>
            ) : (
              <RatingCount compact={compact}>Aucune note</RatingCount>
            )}
          </RatingInfo>
        </div>

        {/* Bouton pour commencer à noter en mode compact ou normal */}
        {!isRating && !readonly && (
          <StartRatingButton compact={compact} onClick={handleStartRating}>
            {getButtonText()}
          </StartRatingButton>
        )}
      </RatingDisplay>

      {/* Affichage de la note utilisateur seulement en mode non-compact */}
      {userRating && !isRating && !compact && (
        <RatingInfo>
          <UserRatingDisplay compact={compact}>
            Votre note: {userRating}/10
          </UserRatingDisplay>
        </RatingInfo>
      )}

      {/* Affichage compact de la note utilisateur */}
      {userRating && !isRating && compact && (
        <UserRatingDisplay compact={compact}>
          Ma note: {userRating}/10
        </UserRatingDisplay>
      )}

      {/* Interface de notation */}
      {isRating && (
        <NumericRatingContainer>
          <RatingLabel>
            Notez ce {itemType === 'protocol' ? 'protocole' : itemType === 'questionnaire' ? 'questionnaire' : 'cas'} de 0 à 10 (par incréments de 0.5)
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
            placeholder={getCommentPlaceholder()}
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