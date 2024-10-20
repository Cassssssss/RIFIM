import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Assurez-vous d'avoir installé lucide-react

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const TutorialContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 80%;
  max-height: 80%;
  overflow-y: auto;
  position: relative;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  margin-bottom: 1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.primary};
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const NavButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.secondary};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const StepIndicator = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-weight: bold;
`;

const TutorialOverlay = ({ steps, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <OverlayContainer>
      <TutorialContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Image src={steps[currentStep].image} alt={`Étape ${currentStep + 1}`} />
        <p>{steps[currentStep].description}</p>
        <StepIndicator>
          Étape {currentStep + 1} sur {steps.length}
        </StepIndicator>
        <NavigationButtons>
          <NavButton onClick={prevStep} disabled={currentStep === 0}>
            <ChevronLeft size={16} style={{ marginRight: '5px' }} />
            Précédent
          </NavButton>
          <NavButton onClick={nextStep}>
            {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
            {currentStep < steps.length - 1 && <ChevronRight size={16} style={{ marginLeft: '5px' }} />}
          </NavButton>
        </NavigationButtons>
      </TutorialContent>
    </OverlayContainer>
  );
};

export default TutorialOverlay;