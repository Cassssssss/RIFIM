import React, { useState } from 'react';
import styled from 'styled-components';
import { Star } from 'lucide-react';
import axios from '../utils/axiosConfig';

// ==================== STYLED COMPONENTS ====================

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const StarsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const InteractiveStar = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
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
`;

const RatingCount = styled.span`
  color: ${props => props.theme.textSecondary};
`;

const CommentInput = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.borderLight};
  border-radius: 4px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  resize: vertical;

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
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const RatingButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background-color: ${props => props.theme.primary};
    color: white;

    &:hover:not(:disabled) {
      background-color: ${props => props.theme.primaryDark};
    }
  }

  &.secondary {
    background-color: ${props => props.theme.textSecondary};
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
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  margin-top: 0.5rem;

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

// ==================== COMPOSANT PRINCIPAL ====================

function RatingStars({ 
  protocolId, 
  averageRating = 0, 
  ratingsCount = 0, 
  userRating = null,
  onRatingUpdate,
  readonly = false,
  size = 16
}) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(userRating || 0);
  const [comment, setComment] = useState('');
  const [isRating, setIsRating] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Convertir la note de 0-10 vers 0-5 pour l'affichage des étoiles
  const displayRating = averageRating / 2;
  const displayUserRating = selectedRating / 2;
  const displayHoveredRating = hoveredRating / 2;

  const handleStarClick = (starIndex) => {
    if (readonly || loading) return;

    // Convertir l'index d'étoile (1-5) vers la note système (0-10)
    const newRating = starIndex * 2;
    setSelectedRating(newRating);
    setIsRating(true);
    setShowCommentInput(true);
  };

  const handleStarHover = (starIndex) => {
    if (readonly || loading) return;
    
    // Convertir l'index d'étoile (1-5) vers la note système (0-10)
    setHoveredRating(starIndex * 2);
  };

  const handleMouseLeave = () => {
    if (readonly || loading) return;
    setHoveredRating(0);
  };

  const submitRating = async () => {
    if (!selectedRating) {
      setMessage('Veuillez sélectionner une note');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`/protocols/${protocolId}/rate`, {
        rating: selectedRating,
        comment: comment.trim()
      });

      setMessage('Note ajoutée avec succès !');
      setIsRating(false);
      setShowCommentInput(false);
      
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
      await axios.delete(`/protocols/${protocolId}/rate`);
      
      setSelectedRating(0);
      setComment('');
      setIsRating(false);
      setShowCommentInput(false);
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
    setShowCommentInput(false);
    setMessage('');
  };

  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      const isFilled = readonly 
        ? i <= displayRating
        : i <= (displayHoveredRating || displayUserRating);
      
      const isHalfFilled = readonly && 
        i === Math.ceil(displayRating) && 
        displayRating % 1 >= 0.5 && 
        !isFilled;

      stars.push(
        <InteractiveStar
          key={i}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          disabled={readonly || loading}
        >
          <Star
            size={size}
            fill={isFilled ? "gold" : "none"}
            stroke={isFilled ? "gold" : "#d1d5db"}
            style={{ 
              opacity: isHalfFilled ? 0.5 : 1,
              filter: isFilled ? 'drop-shadow(0 1px 2px rgba(255, 215, 0, 0.3))' : 'none'
            }}
          />
        </InteractiveStar>
      );
    }
    
    return stars;
  };

  return (
    <RatingContainer onMouseLeave={handleMouseLeave}>
      <StarsContainer>
        {renderStars()}
      </StarsContainer>

      <RatingInfo>
        {averageRating > 0 ? (
          <>
            <RatingValue>{(averageRating).toFixed(1)}/10</RatingValue>
            <RatingCount>({ratingsCount} avis)</RatingCount>
          </>
        ) : (
          <RatingCount>Aucune note</RatingCount>
        )}
        
        {userRating && !isRating && (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>
            Votre note: {userRating}/10
          </span>
        )}
      </RatingInfo>

      {showCommentInput && (
        <>
          <CommentInput
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Commentaire (optionnel)..."
            disabled={loading}
          />
          
          <RatingActions>
            <RatingButton 
              className="primary" 
              onClick={submitRating}
              disabled={loading || !selectedRating}
            >
              {loading ? 'En cours...' : (userRating ? 'Modifier' : 'Noter')}
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
                className="secondary" 
                onClick={deleteRating}
                disabled={loading}
                style={{ marginLeft: 'auto' }}
              >
                Supprimer ma note
              </RatingButton>
            )}
          </RatingActions>
        </>
      )}

      {message && (
        <Message className={message.includes('succès') ? 'success' : 'error'}>
          {message}
        </Message>
      )}
    </RatingContainer>
  );
}

export default RatingStars;