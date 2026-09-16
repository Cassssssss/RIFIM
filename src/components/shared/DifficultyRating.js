import React from 'react';
import styled from 'styled-components';

const Scale = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin: 0.65rem 0;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.72rem;
`;

const Steps = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
`;

const Step = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  padding: 0;
  background: transparent;
  min-width: 0;
  &::after {
    content: '';
    display: block;
    width: 13px;
    height: 5px;
    border-radius: 2px;
    background: ${({ theme, $active }) => $active ? theme.primary : theme.border};
  }
  &[type='button'] {
    width: 28px;
    min-height: 32px;
    cursor: pointer;
    border-radius: 5px;
    &:hover { background: ${({ theme }) => theme.hover}; }
    &:focus-visible { outline: 2px solid ${({ theme }) => theme.primary}; outline-offset: 2px; }
    @media (pointer: coarse) { width: 36px; min-height: 44px; }
  }
`;

export default function DifficultyRating({ value = 0, onChange }) {
  const rating = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <Scale>
      <span>Difficulté {rating}/5</span>
      <Steps role={onChange ? 'group' : undefined} aria-label={onChange ? 'Choisir la difficulté' : undefined} aria-hidden={!onChange}>
        {[1, 2, 3, 4, 5].map(step => (
          <Step key={step} as={onChange ? 'button' : 'span'}
            type={onChange ? 'button' : undefined} $active={rating >= step}
            aria-label={onChange ? `Difficulté ${step} sur 5` : undefined}
            aria-pressed={onChange ? rating === step : undefined}
            onClick={onChange ? () => onChange(step) : undefined} />
        ))}
      </Steps>
    </Scale>
  );
}
