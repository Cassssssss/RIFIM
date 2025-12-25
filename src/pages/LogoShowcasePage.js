import React from 'react';
import styled from 'styled-components';
import {
  Logo1, Logo2, Logo3, Logo4, Logo5,
  Logo6, Logo7, Logo8, Logo9, Logo10,
  Logo11, Logo12, Logo13, Logo14, Logo15,
  Logo16, Logo17, Logo18, Logo19, Logo20,
  Logo21, Logo22, Logo23, Logo24, Logo25,
  Logo26, Logo27, Logo28, Logo29, Logo30,
  Logo31, Logo32, Logo33, Logo34, Logo35,
  Logo36, Logo37, Logo38, Logo39, Logo40,
  Logo41, Logo42, Logo43, Logo44, Logo45,
  Logo46, Logo47, Logo48, Logo49, Logo50
} from '../components/shared/Logos50Collection';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  padding-top: 80px;
`;

const Title = styled.h1`
  text-align: center;
  color: ${props => props.theme.text};
  font-size: 2.5rem;
  margin: 2rem 0;
  font-weight: 700;
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const ShowcaseContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const LogoCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: ${props => props.theme.card};
  border-radius: 12px;
  border: 2px solid ${props => props.theme.border};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }
`;

const LogoNumber = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
`;

const LogoName = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
  text-align: center;
  line-height: 1.3;
`;

const LogoShowcasePage = () => {
  const logos = [
    { component: Logo1, name: "Stéthoscope (GARDÉ)", number: 1 },
    { component: Logo2, name: "Infinity Medical", number: 2 },
    { component: Logo3, name: "Pulse Minimal", number: 3 },
    { component: Logo4, name: "Pentagon Medical", number: 4 },
    { component: Logo5, name: "Orbit", number: 5 },
    { component: Logo6, name: "Wave Sync", number: 6 },
    { component: Logo7, name: "Triple Ring", number: 7 },
    { component: Logo8, name: "Hexagon Grid", number: 8 },
    { component: Logo9, name: "Diamond Pro", number: 9 },
    { component: Logo10, name: "Spiral", number: 10 },
    { component: Logo11, name: "Cross Modern", number: 11 },
    { component: Logo12, name: "Leaf Medical", number: 12 },
    { component: Logo13, name: "Shield Minimal", number: 13 },
    { component: Logo14, name: "Arrow Circle", number: 14 },
    { component: Logo15, name: "Triangle Trio", number: 15 },
    { component: Logo16, name: "Radiologie X (GARDÉ)", number: 16 },
    { component: Logo17, name: "Atom (GARDÉ)", number: 17 },
    { component: Logo18, name: "Letter M Medical", number: 18 },
    { component: Logo19, name: "Droplet Minimal", number: 19 },
    { component: Logo20, name: "Star Medical", number: 20 },
    { component: Logo21, name: "Chevron Up", number: 21 },
    { component: Logo22, name: "Plus Circle", number: 22 },
    { component: Logo23, name: "Double Triangle", number: 23 },
    { component: Logo24, name: "Square Rotation", number: 24 },
    { component: Logo25, name: "Lightning", number: 25 },
    { component: Logo26, name: "Target", number: 26 },
    { component: Logo27, name: "Molecule Chain", number: 27 },
    { component: Logo28, name: "Gear", number: 28 },
    { component: Logo29, name: "Heart Simple", number: 29 },
    { component: Logo30, name: "Circle Grid", number: 30 },
    { component: Logo31, name: "Check Circle", number: 31 },
    { component: Logo32, name: "Bookmark", number: 32 },
    { component: Logo33, name: "Bell", number: 33 },
    { component: Logo34, name: "Lock", number: 34 },
    { component: Logo35, name: "Wifi Signal", number: 35 },
    { component: Logo36, name: "Stérilisation (GARDÉ)", number: 36 },
    { component: Logo37, name: "Battery", number: 37 },
    { component: Logo38, name: "Pen", number: 38 },
    { component: Logo39, name: "Download", number: 39 },
    { component: Logo40, name: "Upload", number: 40 },
    { component: Logo41, name: "Cloud", number: 41 },
    { component: Logo42, name: "Folder", number: 42 },
    { component: Logo43, name: "Eye", number: 43 },
    { component: Logo44, name: "Clipboard", number: 44 },
    { component: Logo45, name: "Calendar", number: 45 },
    { component: Logo46, name: "User", number: 46 },
    { component: Logo47, name: "Users", number: 47 },
    { component: Logo48, name: "Settings Modern", number: 48 },
    { component: Logo49, name: "Map Pin", number: 49 },
    { component: Logo50, name: "Search", number: 50 }
  ];

  return (
    <PageContainer>
      <Title>Choisissez votre logo préféré</Title>
      <Subtitle>50 logos professionnels épurés • Style tech moderne • #1, #16, #17, #36 gardés</Subtitle>
      <ShowcaseContainer>
        {logos.map(({ component: LogoComponent, name, number }) => (
          <LogoCard key={number}>
            <LogoNumber>#{number}</LogoNumber>
            <LogoComponent />
            <LogoName>{name}</LogoName>
          </LogoCard>
        ))}
      </ShowcaseContainer>
    </PageContainer>
  );
};

export default LogoShowcasePage;
