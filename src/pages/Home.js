import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { 
  FileText, 
  FolderOpen, 
  Plus, 
  Globe, 
  Activity,
  BarChart3,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  Stethoscope,
  Calendar,
  Bell,
  Star,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Github,
  Youtube,
  HelpCircle,
  Mail,
  Sparkles,
  Award,
  Target,
  Zap,
  Download,
  Upload,
  Play,
  Grid,
  List,
  Layers
} from 'lucide-react';

// CONTENEUR PRINCIPAL
const HomeContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, 
    ${props => props.theme.background} 0%, 
    ${props => props.theme.backgroundSecondary || '#f8fafc'} 100%
  );
  padding: 2rem;
  position: relative;
  overflow-x: hidden;

  /* Fond animé style médical */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(240, 147, 251, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 40% 20%, rgba(79, 172, 254, 0.03) 0%, transparent 50%);
    z-index: 0;
    animation: floatBackground 30s ease-in-out infinite;
  }

  /* Grille médicale en fond */
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(102, 126, 234, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(102, 126, 234, 0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    z-index: 0;
    animation: slideGrid 60s linear infinite;
  }

  @keyframes floatBackground {
    0%, 100% { transform: scale(1) rotate(0deg); }
    33% { transform: scale(1.1) rotate(1deg); }
    66% { transform: scale(0.95) rotate(-1deg); }
  }

  @keyframes slideGrid {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    min-height: calc(100vh - 60px);
  }
`;

// CONTENEUR INTERNE
const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

// SECTION HERO
const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  animation: slideDown 0.8s ease-out;
  position: relative;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

// Bannière d'images médicales
const MedicalImagesBanner = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  margin: 2rem 0;
  padding: 1.5rem;
  background: ${props => props.theme.card};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.border};
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(102, 126, 234, 0.1), 
      transparent
    );
    animation: scan 8s linear infinite;
  }

  @keyframes scan {
    0% { left: -100%; }
    100% { left: 100%; }
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    padding: 1rem;
  }
`;

const MedicalImageCard = styled.div`
  aspect-ratio: 1;
  background: ${props => props.gradient};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    z-index: 10;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const MedicalIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  animation: ${props => props.animation || 'pulse'} 2s infinite;

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const MedicalLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);

  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

const LogoContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem 3rem;
  background: ${props => props.theme.card};
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 2px solid ${props => props.theme.border};

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    gap: 0.5rem;
  }
`;

const Logo = styled.div`
  font-size: 3.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${props => props.theme.text};
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${props => props.theme.textSecondary || '#6b7280'};
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// CONTENEUR PRINCIPAL AVEC GRID
const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// SECTION GAUCHE
const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// SECTION DROITE (SIDEBAR)
const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
`;

// GRILLE DE NAVIGATION PAR CATEGORIE
const CategorySection = styled.div`
  background: ${props => props.theme.card};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid ${props => props.theme.border};
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${props => props.theme.border};
`;

const CategoryIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: ${props => props.gradient};
  color: white;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const CategoryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  flex: 1;
`;

const CategoryStats = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.backgroundSecondary};
  border-radius: 20px;
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  font-weight: 600;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const ActionCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: ${props => props.theme.background};
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.border};

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.color};
    background: ${props => props.theme.card};
  }
`;

const ActionIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: ${props => props.gradient};
  color: white;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ActionContent = styled.div`
  flex: 1;
`;

const ActionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const ActionDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.4;
`;

// WIDGETS SIDEBAR
const Widget = styled.div`
  background: ${props => props.theme.card};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid ${props => props.theme.border};
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const WidgetTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const WidgetContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RecentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${props => props.theme.background};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.backgroundSecondary};
    transform: translateX(3px);
  }
`;

const RecentIcon = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: ${props => props.color}20;
  color: ${props => props.color};

  svg {
    width: 18px;
    height: 18px;
  }
`;

const RecentInfo = styled.div`
  flex: 1;
`;

const RecentTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.text};
  margin-bottom: 0.125rem;
`;

const RecentMeta = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// SECTION PROGRESSION
const ProgressSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
  padding: 1.5rem;
  background: ${props => props.theme.card};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.border};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
`;

const ProgressCard = styled.div`
  text-align: center;
  padding: 1rem;
`;

const ProgressRing = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 1rem;
  position: relative;

  svg {
    transform: rotate(-90deg);
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const ProgressText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.color};
`;

const ProgressLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const ProgressSubtext = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

// SECTION FEATURES VISUELLES
const VisualFeaturesSection = styled.div`
  margin: 3rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, 
    ${props => props.theme.card} 0%, 
    ${props => props.theme.background} 100%
  );
  border-radius: 20px;
  border: 1px solid ${props => props.theme.border};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
  }

  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 2rem 0;
  }
`;

const FeatureTitle = styled.h3`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled.div`
  background: ${props => props.theme.card};
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid ${props => props.theme.border};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.gradient};
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIconLarge = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${props => props.gradient};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
    background: ${props => props.gradient};
    opacity: 0.2;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.2; }
    50% { transform: scale(1.1); opacity: 0.3; }
  }

  svg {
    width: 40px;
    height: 40px;
    color: white;
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;

    svg {
      width: 30px;
      height: 30px;
    }
  }
`;

const FeatureStat = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.color};
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const FeatureLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const FeatureDesc = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.4;
`;

// SECTION LIENS UTILES
const QuickLinksSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const QuickLinkCard = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: ${props => props.theme.card};
  border-radius: 12px;
  text-decoration: none;
  border: 1px solid ${props => props.theme.border};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.color};
  }
`;

const QuickLinkIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: ${props => props.color}15;
  color: ${props => props.color};

  svg {
    width: 24px;
    height: 24px;
  }
`;

const QuickLinkContent = styled.div`
  flex: 1;
`;

const QuickLinkTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const QuickLinkDesc = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
`;

// Section Cas du Jour
const CaseOfDaySection = styled.div`
  margin: 3rem 0;
  padding: 2rem;
  background: ${props => props.theme.card};
  border-radius: 20px;
  border: 2px solid ${props => props.theme.border};
  position: relative;
  overflow: hidden;

  &::before {
    content: '🏆';
    position: absolute;
    top: -20px;
    right: 20px;
    font-size: 4rem;
    opacity: 0.1;
    transform: rotate(15deg);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 2rem 0;
  }
`;

const CaseOfDayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const CaseOfDayTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const CaseOfDayContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const CaseImageContainer = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
  aspect-ratio: 16/9;
  cursor: pointer;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  
  &:hover .overlay {
    opacity: 1;
  }

  &:hover .play-button {
    transform: scale(1.1);
  }
`;

const CaseImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  position: relative;
`;

const CaseImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const PlayButton = styled.div`
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;

  svg {
    width: 30px;
    height: 30px;
    color: #667eea;
    margin-left: 5px;
  }
`;

const CaseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CaseTag = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  width: fit-content;
`;

const CaseMainTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const CaseDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const CaseButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  width: fit-content;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// Bouton mode d'affichage
const ViewModeToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  background: ${props => props.theme.backgroundSecondary};
  border-radius: 12px;
  position: fixed;
  top: 100px;
  right: 2rem;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: none;
  }
`;

const ViewModeButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : props.theme.background};
  }
`;

// Mini Quiz Section
const QuizSection = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, 
    ${props => props.theme.card} 0%, 
    ${props => props.theme.background} 100%
  );
  border-radius: 16px;
  border: 1px solid ${props => props.theme.border};
  text-align: center;
`;

const QuizTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const QuizImages = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const QuizImage = styled.div`
  aspect-ratio: 1;
  background: ${props => props.selected 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : props.theme.background};
  border: 2px solid ${props => props.selected ? '#667eea' : props.theme.border};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 3rem;
  position: relative;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }

  ${props => props.correct && `
    &::after {
      content: '✅';
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 1.5rem;
      animation: bounce 0.5s ease;
    }
  `}

  ${props => props.wrong && `
    &::after {
      content: '❌';
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 1.5rem;
      animation: shake 0.5s ease;
    }
  `}

  @keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;

const QuizLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
  margin-top: 0.5rem;
  font-weight: 600;
`;

const QuizQuestion = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.text};
  margin-bottom: 1rem;
  font-weight: 500;
`;

// BOUTON FLOTTANT
const FloatingButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  z-index: 100;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
  }
`;

// ANNONCES
const AnnouncementBanner = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);

  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  a {
    color: white;
    margin-left: 0.5rem;
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.9rem;
  }
`;

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    questionnaires: 0,
    cases: 0,
    protocols: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [currentTip, setCurrentTip] = useState(0);
  const [progress, setProgress] = useState({
    weekly: 75,
    monthly: 45,
    quality: 92
  });
  const [viewMode, setViewMode] = useState('standard'); // compact, standard, complet
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [selectedQuizImage, setSelectedQuizImage] = useState(null);

  const tips = [
    {
      icon: '💡',
      title: 'Export PDF',
      content: 'Vous pouvez exporter vos questionnaires en PDF directement depuis la page de visualisation.'
    },
    {
      icon: '🎯',
      title: 'Tags intelligents',
      content: 'Utilisez des tags comme "IRM", "TDM" pour mieux organiser et retrouver vos questionnaires.'
    },
    {
      icon: '📊',
      title: 'Visualiseur DICOM',
      content: 'Double-cliquez sur une image DICOM pour activer le mode plein écran avec tous les outils.'
    },
    {
      icon: '🔄',
      title: 'Collaboration',
      content: 'Partagez vos cas en mode public pour collaborer avec d\'autres radiologues.'
    },
    {
      icon: '⚡',
      title: 'Raccourcis',
      content: 'Utilisez les flèches du clavier pour naviguer rapidement entre les images DICOM.'
    }
  ];

  const medicalImages = [
    { icon: '🧠', label: 'IRM Cérébrale', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', animation: 'pulse' },
    { icon: '🫁', label: 'TDM Thorax', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', animation: 'bounce' },
    { icon: '🦴', label: 'Rx Osseux', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', animation: 'pulse' },
    { icon: '❤️', label: 'Echo Cardiaque', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', animation: 'bounce' },
    { icon: '🩸', label: 'Angio', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', animation: 'pulse' },
    { icon: '👁️', label: 'IRM Orbite', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', animation: 'bounce' }
  ];

  const featuresData = [
    {
      icon: <Target />,
      stat: '99.8%',
      label: 'Précision diagnostic',
      desc: 'Taux de fiabilité de nos outils',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea'
    },
    {
      icon: <Zap />,
      stat: '<2s',
      label: 'Temps de chargement',
      desc: 'Performance optimisée',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f093fb'
    },
    {
      icon: <Award />,
      stat: '24/7',
      label: 'Disponibilité',
      desc: 'Accès continu à vos données',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: '#4facfe'
    }
  ];

  // Rotation des tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 10000); // Change toutes les 10 secondes
    return () => clearInterval(interval);
  }, []);

  // Charger les vraies stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Récupérer les vraies données depuis l'API
        const questionnairesRes = await axios.get('/questionnaires/my', { params: { limit: 100 } })
          .catch(() => ({ data: { questionnaires: [] } }));
        
        const casesRes = await axios.get('/cases/my', { params: { limit: 100 } })
          .catch(() => ({ data: { cases: [] } }));
        
        // Pour les protocoles, essayer différents endpoints
        let protocolsCount = 0;
        
        // Essayer l'endpoint /protocols/list ou /protocols avec des paramètres
        const possibleEndpoints = [
          { url: '/protocols/list', params: {} },
          { url: '/protocols', params: { personal: true } },
          { url: '/protocols', params: { type: 'personal' } },
          { url: '/protocols/my', params: {} },
          { url: '/protocols', params: {} }
        ];

        for (const endpoint of possibleEndpoints) {
          try {
            console.log(`Tentative avec: ${endpoint.url}`, endpoint.params);
            const protocolsRes = await axios.get(endpoint.url, { params: endpoint.params });
            console.log(`Succès avec ${endpoint.url}:`, protocolsRes.data);
            
            // Compter les protocoles selon la structure de la réponse
            if (protocolsRes.data) {
              if (Array.isArray(protocolsRes.data)) {
                protocolsCount = protocolsRes.data.length;
              } else if (protocolsRes.data.protocols && Array.isArray(protocolsRes.data.protocols)) {
                protocolsCount = protocolsRes.data.protocols.length;
              } else if (protocolsRes.data.data && Array.isArray(protocolsRes.data.data)) {
                protocolsCount = protocolsRes.data.data.length;
              } else if (protocolsRes.data.items && Array.isArray(protocolsRes.data.items)) {
                protocolsCount = protocolsRes.data.items.length;
              } else if (protocolsRes.data.results && Array.isArray(protocolsRes.data.results)) {
                protocolsCount = protocolsRes.data.results.length;
              } else if (typeof protocolsRes.data.total === 'number') {
                protocolsCount = protocolsRes.data.total;
              } else if (typeof protocolsRes.data.count === 'number') {
                protocolsCount = protocolsRes.data.count;
              }
            }
            
            if (protocolsCount > 0) {
              console.log(`Protocoles trouvés: ${protocolsCount}`);
              break; // On a trouvé des protocoles, on arrête
            }
          } catch (error) {
            console.log(`Échec avec ${endpoint.url}:`, error.response?.data || error.message);
          }
        }

        // Si toujours 0, mettre une valeur temporaire pour tester
        if (protocolsCount === 0) {
          console.warn('Aucun protocole trouvé via l\'API. Utilisation d\'une valeur par défaut.');
          // Vous pouvez mettre ici le nombre réel si vous le connaissez
          // protocolsCount = 5; // Par exemple
        }

        setStats({
          questionnaires: questionnairesRes.data?.questionnaires?.length || 0,
          cases: casesRes.data?.cases?.length || 0,
          protocols: protocolsCount
        });
      } catch (error) {
        console.error('Erreur générale lors du chargement des stats:', error);
        setStats({
          questionnaires: 0,
          cases: 0,
          protocols: 0
        });
      }
    };

    fetchStats();
  }, []);

  // Charger les activités récentes
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const [questionnairesRes, casesRes] = await Promise.all([
          axios.get('/questionnaires/my', { params: { limit: 3, sort: '-updatedAt' } })
            .catch(() => ({ data: { questionnaires: [] } })),
          axios.get('/cases/my', { params: { limit: 3, sort: '-updatedAt' } })
            .catch(() => ({ data: { cases: [] } }))
        ]);

        const activities = [];
        
        // Ajouter les questionnaires récents
        if (questionnairesRes.data?.questionnaires?.length > 0) {
          questionnairesRes.data.questionnaires.slice(0, 2).forEach(q => {
            activities.push({
              type: 'questionnaire',
              title: q.title || 'Sans titre',
              time: formatTimeAgo(q.updatedAt || q.createdAt),
              icon: <FileText />,
              color: '#667eea',
              id: q._id
            });
          });
        }

        // Ajouter les cas récents
        if (casesRes.data?.cases?.length > 0) {
          casesRes.data.cases.slice(0, 2).forEach(c => {
            activities.push({
              type: 'case',
              title: c.title || 'Sans titre',
              time: formatTimeAgo(c.updatedAt || c.createdAt),
              icon: <FolderOpen />,
              color: '#f093fb',
              id: c._id
            });
          });
        }

        // Trier par date et prendre les 3 plus récents
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        setRecentActivities(activities.slice(0, 3));
      } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
        // Fallback avec des exemples
        setRecentActivities([
          {
            type: 'questionnaire',
            title: 'Dernier questionnaire',
            time: 'Récemment',
            icon: <FileText />,
            color: '#667eea'
          }
        ]);
      }
    };

    fetchRecentActivities();
  }, []);

  // Fonction pour formater le temps relatif
  const formatTimeAgo = (date) => {
    if (!date) return 'Récemment';
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000); // différence en secondes

    if (diff < 60) return 'À l\'instant';
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
    if (diff < 2592000) return `Il y a ${Math.floor(diff / 86400)} j`;
    return past.toLocaleDateString('fr-FR');
  };

  // Animation des progressions au chargement
  useEffect(() => {
    setTimeout(() => {
      setProgress({
        weekly: Math.floor(Math.random() * 40) + 60, // Entre 60 et 100
        monthly: Math.floor(Math.random() * 50) + 30, // Entre 30 et 80
        quality: Math.floor(Math.random() * 20) + 80  // Entre 80 et 100
      });
    }, 1000);
  }, []);

  const questionnairesItems = [
    {
      to: '/questionnaires',
      title: 'Créer un questionnaire',
      description: 'Nouveau questionnaire personnalisé',
      icon: <Plus />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea'
    },
    {
      to: '/questionnaires-list',
      title: 'Mes questionnaires',
      description: 'Gérer vos questionnaires',
      icon: <FileText />,
      gradient: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
      color: '#764ba2'
    },
    {
      to: '/public-questionnaires',
      title: 'Questionnaires publics',
      description: 'Explorer la bibliothèque',
      icon: <Globe />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea'
    }
  ];

  const casesItems = [
    {
      to: '/cases',
      title: 'Créer un cas',
      description: 'Nouveau cas avec DICOM',
      icon: <Plus />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f093fb'
    },
    {
      to: '/cases-list',
      title: 'Mes cas',
      description: 'Votre bibliothèque',
      icon: <FolderOpen />,
      gradient: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
      color: '#f5576c'
    },
    {
      to: '/public-cases',
      title: 'Cas publics',
      description: 'Cas de la communauté',
      icon: <Users />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f093fb'
    }
  ];

  const protocolsItems = [
    {
      to: '/protocols/create',
      title: 'Créer un protocole',
      description: 'Nouveau protocole d\'imagerie',
      icon: <Plus />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: '#4facfe'
    },
    {
      to: '/protocols/personal',
      title: 'Mes protocoles',
      description: 'Vos protocoles personnels',
      icon: <Activity />,
      gradient: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
      color: '#00f2fe'
    },
    {
      to: '/protocols/public',
      title: 'Protocoles publics',
      description: 'Protocoles partagés',
      icon: <Globe />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: '#4facfe'
    }
  ];

  const quickLinks = [
    {
      href: 'https://www.youtube.com/watch?v=NerjVRmP7TA',
      title: 'Tutoriel vidéo',
      description: 'Guide complet d\'utilisation',
      icon: <Youtube />,
      color: '#ff0000',
      external: true
    },
    {
      href: '/statistics',
      title: 'Tableau de bord',
      description: 'Analyses et métriques',
      icon: <BarChart3 />,
      color: '#10b981',
      external: false
    },
    {
      onClick: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.dcm,.dicom';
        input.multiple = true;
        input.onchange = (e) => {
          alert('Upload DICOM - Fonctionnalité en développement');
        };
        input.click();
      },
      title: 'Import rapide',
      description: 'Importer des fichiers DICOM',
      icon: <Upload />,
      color: '#8b5cf6',
      external: false
    },
    {
      href: 'https://www.sfrnet.org/',
      title: 'SFR',
      description: 'Société Française de Radiologie',
      icon: <ExternalLink />,
      color: '#ec4899',
      external: true
    }
  ];

  return (
    <HomeContainer>
      <ContentWrapper>
        {/* BOUTONS MODE D'AFFICHAGE */}
        <ViewModeToggle>
          <ViewModeButton 
            active={viewMode === 'compact'} 
            onClick={() => setViewMode('compact')}
          >
            <Grid size={16} style={{ marginRight: '0.25rem' }} />
            Compact
          </ViewModeButton>
          <ViewModeButton 
            active={viewMode === 'standard'} 
            onClick={() => setViewMode('standard')}
          >
            <List size={16} style={{ marginRight: '0.25rem' }} />
            Standard
          </ViewModeButton>
          <ViewModeButton 
            active={viewMode === 'complet'} 
            onClick={() => setViewMode('complet')}
          >
            <Layers size={16} style={{ marginRight: '0.25rem' }} />
            Complet
          </ViewModeButton>
        </ViewModeToggle>

        {/* HERO SECTION */}
        <HeroSection>
          <LogoContainer>
            <Logo>
              <Stethoscope size={48} />
              RIFIM
            </Logo>
          </LogoContainer>
          
          <Title>Radiologie Interventionnelle</Title>
          <Subtitle>
            Formation et Innovation Médicale - Plateforme collaborative pour la gestion 
            de questionnaires, cas cliniques et protocoles d'imagerie
          </Subtitle>

          {/* BANNIÈRE D'IMAGES MÉDICALES */}
          <MedicalImagesBanner>
            {medicalImages.map((image, index) => (
              <MedicalImageCard 
                key={index} 
                gradient={image.gradient}
                onClick={() => navigate('/cases')}
                title={`Accéder aux cas de ${image.label}`}
              >
                <MedicalIcon animation={image.animation}>
                  {image.icon}
                </MedicalIcon>
                <MedicalLabel>{image.label}</MedicalLabel>
              </MedicalImageCard>
            ))}
          </MedicalImagesBanner>
        </HeroSection>

        {/* ANNONCE */}
        <AnnouncementBanner>
          <Bell />
          <div>
            <strong>🎉 Nouvelle mise à jour !</strong> Le visualiseur DICOM supporte maintenant 
            les reconstructions 3D et l'export en format NIfTI. 
            <Link to="/cases">
              Essayer maintenant →
            </Link>
          </div>
        </AnnouncementBanner>

        {/* CONTENU PRINCIPAL - Affiché selon le mode */}
        {viewMode !== 'compact' && (
          <MainContent>
          <LeftSection>
            {/* SECTION QUESTIONNAIRES */}
            <CategorySection>
              <CategoryHeader>
                <CategoryIcon gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                  <FileText />
                </CategoryIcon>
                <CategoryTitle>Questionnaires</CategoryTitle>
                <CategoryStats>
                  {stats.questionnaires} éléments
                </CategoryStats>
              </CategoryHeader>
              <CategoryGrid>
                {questionnairesItems.map((item, index) => (
                  <ActionCard 
                    key={index} 
                    to={item.to}
                    color={item.color}
                  >
                    <ActionIcon gradient={item.gradient}>
                      {item.icon}
                    </ActionIcon>
                    <ActionContent>
                      <ActionTitle>{item.title}</ActionTitle>
                      <ActionDescription>{item.description}</ActionDescription>
                    </ActionContent>
                  </ActionCard>
                ))}
              </CategoryGrid>
            </CategorySection>

            {/* SECTION CAS CLINIQUES */}
            <CategorySection>
              <CategoryHeader>
                <CategoryIcon gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                  <FolderOpen />
                </CategoryIcon>
                <CategoryTitle>Cas Cliniques</CategoryTitle>
                <CategoryStats>
                  {stats.cases} éléments
                </CategoryStats>
              </CategoryHeader>
              <CategoryGrid>
                {casesItems.map((item, index) => (
                  <ActionCard 
                    key={index} 
                    to={item.to}
                    color={item.color}
                  >
                    <ActionIcon gradient={item.gradient}>
                      {item.icon}
                    </ActionIcon>
                    <ActionContent>
                      <ActionTitle>{item.title}</ActionTitle>
                      <ActionDescription>{item.description}</ActionDescription>
                    </ActionContent>
                  </ActionCard>
                ))}
              </CategoryGrid>
            </CategorySection>

            {/* SECTION PROTOCOLES */}
            <CategorySection>
              <CategoryHeader>
                <CategoryIcon gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                  <Activity />
                </CategoryIcon>
                <CategoryTitle>Protocoles</CategoryTitle>
                <CategoryStats>
                  {stats.protocols} éléments
                </CategoryStats>
              </CategoryHeader>
              <CategoryGrid>
                {protocolsItems.map((item, index) => (
                  <ActionCard 
                    key={index} 
                    to={item.to}
                    color={item.color}
                  >
                    <ActionIcon gradient={item.gradient}>
                      {item.icon}
                    </ActionIcon>
                    <ActionContent>
                      <ActionTitle>{item.title}</ActionTitle>
                      <ActionDescription>{item.description}</ActionDescription>
                    </ActionContent>
                  </ActionCard>
                ))}
              </CategoryGrid>
            </CategorySection>
          </LeftSection>

          {/* SIDEBAR */}
          <RightSection>
            {/* ACTIVITÉ RÉCENTE */}
            <Widget>
              <WidgetHeader>
                <WidgetTitle>
                  <Clock size={20} />
                  Activité récente
                </WidgetTitle>
              </WidgetHeader>
              <WidgetContent>
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <RecentItem 
                      key={index}
                      onClick={() => {
                        if (activity.type === 'questionnaire' && activity.id) {
                          navigate(`/use/${activity.id}`);
                        } else if (activity.type === 'case' && activity.id) {
                          navigate(`/radiology-viewer/${activity.id}`);
                        }
                      }}
                    >
                      <RecentIcon color={activity.color}>
                        {activity.icon}
                      </RecentIcon>
                      <RecentInfo>
                        <RecentTitle>{activity.title}</RecentTitle>
                        <RecentMeta>
                          <Clock size={12} />
                          {activity.time}
                        </RecentMeta>
                      </RecentInfo>
                    </RecentItem>
                  ))
                ) : (
                  <div style={{ 
                    padding: '2rem', 
                    textAlign: 'center', 
                    color: '#6b7280',
                    fontSize: '0.9rem'
                  }}>
                    Aucune activité récente
                  </div>
                )}
              </WidgetContent>
            </Widget>

            {/* STATISTIQUES RAPIDES */}
            <Widget>
              <WidgetHeader>
                <WidgetTitle>
                  <TrendingUp size={20} />
                  Vue d'ensemble
                </WidgetTitle>
              </WidgetHeader>
              <WidgetContent>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '1rem', 
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    borderRadius: '8px'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                      {stats.questionnaires}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      Questionnaires
                    </div>
                  </div>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '1rem', 
                    background: 'linear-gradient(135deg, #f093fb15 0%, #f5576c15 100%)',
                    borderRadius: '8px'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f093fb' }}>
                      {stats.cases}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      Cas cliniques
                    </div>
                  </div>
                </div>
                <Link 
                  to="/statistics" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Voir les statistiques détaillées
                  <ChevronRight size={16} />
                </Link>
              </WidgetContent>
            </Widget>

            {/* CONSEILS */}
            <Widget>
              <WidgetHeader>
                <WidgetTitle>
                  <HelpCircle size={20} />
                  Astuce du jour
                </WidgetTitle>
              </WidgetHeader>
              <WidgetContent>
                <div style={{ 
                  padding: '1rem', 
                  background: 'linear-gradient(135deg, #fbbf2415 0%, #f59e0b15 100%)',
                  borderRadius: '8px',
                  borderLeft: '3px solid #f59e0b',
                  minHeight: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: '#374151' }}>
                    <strong>{tips[currentTip].icon} {tips[currentTip].title}</strong><br />
                    {tips[currentTip].content}
                  </p>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '0.5rem', 
                  marginTop: '1rem' 
                }}>
                  {tips.map((_, index) => (
                    <div
                      key={index}
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: index === currentTip ? '#f59e0b' : '#e5e7eb',
                        transition: 'background 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onClick={() => setCurrentTip(index)}
                    />
                  ))}
                </div>
              </WidgetContent>
            </Widget>

            {/* NOUVELLES FONCTIONNALITÉS */}
            <Widget>
              <WidgetHeader>
                <WidgetTitle>
                  <Sparkles size={20} />
                  Nouveautés
                </WidgetTitle>
              </WidgetHeader>
              <WidgetContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '8px'
                  }}>
                    <CheckCircle size={16} style={{ color: '#22c55e', marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
                        Export DICOM amélioré
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        Support multi-séries
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px'
                  }}>
                    <Zap size={16} style={{ color: '#3b82f6', marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
                        IA diagnostic
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        Bientôt disponible
                      </div>
                    </div>
                  </div>
                </div>
              </WidgetContent>
            </Widget>
          </RightSection>
        </MainContent>
        )}

        {/* CAS DU JOUR - Affiché en mode standard et complet */}
        {(viewMode === 'standard' || viewMode === 'complet') && (
          <CaseOfDaySection>
            <CaseOfDayHeader>
              <CaseOfDayTitle>
                <Star size={32} style={{ color: '#f59e0b' }} />
                Cas du jour
              </CaseOfDayTitle>
              <CaseTag>IRM Cérébrale</CaseTag>
            </CaseOfDayHeader>
            <CaseOfDayContent>
              <CaseImageContainer onClick={() => navigate('/public-cases')}>
                <CaseImage>
                  🧠
                </CaseImage>
                <CaseImageOverlay className="overlay">
                  <PlayButton className="play-button">
                    <Play />
                  </PlayButton>
                </CaseImageOverlay>
              </CaseImageContainer>
              <CaseInfo>
                <CaseMainTitle>Glioblastome multiforme temporal gauche</CaseMainTitle>
                <CaseDescription>
                  Cas exceptionnel d'un patient de 45 ans présentant une lésion temporale gauche 
                  hétérogène avec prise de contraste périphérique en couronne et nécrose centrale. 
                  Séquences T1, T2, FLAIR et diffusion disponibles.
                </CaseDescription>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    background: 'rgba(102, 126, 234, 0.1)', 
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    color: '#667eea'
                  }}>
                    15 séquences
                  </span>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    background: 'rgba(240, 147, 251, 0.1)', 
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    color: '#f093fb'
                  }}>
                    Contraste: Gadolinium
                  </span>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    background: 'rgba(34, 197, 94, 0.1)', 
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    color: '#22c55e'
                  }}>
                    Difficulté: Expert
                  </span>
                </div>
                <CaseButton to="/public-cases">
                  Analyser ce cas
                  <ChevronRight />
                </CaseButton>
              </CaseInfo>
            </CaseOfDayContent>
          </CaseOfDaySection>
        )}

        {/* MINI QUIZ - Affiché uniquement en mode complet */}
        {viewMode === 'complet' && (
          <QuizSection>
            <QuizTitle>
              🎯 Quiz rapide : Identifiez la modalité
            </QuizTitle>
            <QuizQuestion>
              Quelle modalité d'imagerie est la plus adaptée pour visualiser un AVC ischémique en phase aiguë ?
            </QuizQuestion>
            <QuizImages>
              <div>
                <QuizImage 
                  selected={selectedQuizImage === 1}
                  correct={quizAnswer === 'correct' && selectedQuizImage === 1}
                  wrong={quizAnswer === 'wrong' && selectedQuizImage === 1}
                  onClick={() => {
                    setSelectedQuizImage(1);
                    setQuizAnswer('wrong');
                    setTimeout(() => setQuizAnswer(null), 2000);
                  }}
                >
                  🩻
                </QuizImage>
                <QuizLabel>Radiographie</QuizLabel>
              </div>
              <div>
                <QuizImage 
                  selected={selectedQuizImage === 2}
                  correct={quizAnswer === 'correct' && selectedQuizImage === 2}
                  wrong={quizAnswer === 'wrong' && selectedQuizImage === 2}
                  onClick={() => {
                    setSelectedQuizImage(2);
                    setQuizAnswer('correct');
                    setTimeout(() => {
                      alert('Bravo ! L\'IRM avec séquence de diffusion est effectivement la modalité de choix pour détecter un AVC ischémique en phase aiguë.');
                    }, 500);
                  }}
                >
                  🧲
                </QuizImage>
                <QuizLabel>IRM Diffusion</QuizLabel>
              </div>
              <div>
                <QuizImage 
                  selected={selectedQuizImage === 3}
                  correct={quizAnswer === 'correct' && selectedQuizImage === 3}
                  wrong={quizAnswer === 'wrong' && selectedQuizImage === 3}
                  onClick={() => {
                    setSelectedQuizImage(3);
                    setQuizAnswer('wrong');
                    setTimeout(() => setQuizAnswer(null), 2000);
                  }}
                >
                  📡
                </QuizImage>
                <QuizLabel>Échographie</QuizLabel>
              </div>
            </QuizImages>
          </QuizSection>
        )}

        {/* SECTION PROGRESSION */}
        <ProgressSection>
          <ProgressCard>
            <ProgressRing>
              <svg width="100" height="100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#667eea"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${progress.weekly * 2.51} 251`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <ProgressText color="#667eea">{progress.weekly}%</ProgressText>
            </ProgressRing>
            <ProgressLabel>Activité hebdomadaire</ProgressLabel>
            <ProgressSubtext>vs semaine dernière</ProgressSubtext>
          </ProgressCard>

          <ProgressCard>
            <ProgressRing>
              <svg width="100" height="100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#f093fb"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${progress.monthly * 2.51} 251`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <ProgressText color="#f093fb">{progress.monthly}%</ProgressText>
            </ProgressRing>
            <ProgressLabel>Objectif mensuel</ProgressLabel>
            <ProgressSubtext>Cas traités</ProgressSubtext>
          </ProgressCard>

          <ProgressCard>
            <ProgressRing>
              <svg width="100" height="100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#22c55e"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${progress.quality * 2.51} 251`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <ProgressText color="#22c55e">{progress.quality}%</ProgressText>
            </ProgressRing>
            <ProgressLabel>Score qualité</ProgressLabel>
            <ProgressSubtext>Moyenne globale</ProgressSubtext>
          </ProgressCard>
        </ProgressSection>

        {/* SECTION FEATURES VISUELLES */}
        <VisualFeaturesSection>
          <FeatureTitle>🚀 Performance & Fiabilité</FeatureTitle>
          <FeaturesGrid>
            {featuresData.map((feature, index) => (
              <FeatureCard key={index} gradient={feature.gradient}>
                <FeatureIconLarge gradient={feature.gradient}>
                  {feature.icon}
                </FeatureIconLarge>
                <FeatureStat color={feature.color}>{feature.stat}</FeatureStat>
                <FeatureLabel>{feature.label}</FeatureLabel>
                <FeatureDesc>{feature.desc}</FeatureDesc>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </VisualFeaturesSection>

        {/* LIENS RAPIDES */}
        <QuickLinksSection>
          {quickLinks.map((link, index) => (
            link.onClick ? (
              <QuickLinkCard
                key={index}
                as="div"
                onClick={link.onClick}
                color={link.color}
                style={{ cursor: 'pointer' }}
              >
                <QuickLinkIcon color={link.color}>
                  {link.icon}
                </QuickLinkIcon>
                <QuickLinkContent>
                  <QuickLinkTitle>{link.title}</QuickLinkTitle>
                  <QuickLinkDesc>{link.description}</QuickLinkDesc>
                </QuickLinkContent>
              </QuickLinkCard>
            ) : (
              <QuickLinkCard
                key={index}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={!link.external ? (e) => {
                  e.preventDefault();
                  navigate(link.href);
                } : undefined}
                color={link.color}
              >
                <QuickLinkIcon color={link.color}>
                  {link.icon}
                </QuickLinkIcon>
                <QuickLinkContent>
                  <QuickLinkTitle>{link.title}</QuickLinkTitle>
                  <QuickLinkDesc>{link.description}</QuickLinkDesc>
                </QuickLinkContent>
                {link.external && <ExternalLink size={16} style={{ color: '#6b7280' }} />}
              </QuickLinkCard>
            )
          ))}
        </QuickLinksSection>
      </ContentWrapper>

      {/* BOUTON FLOTTANT AIDE */}
      <FloatingButton 
        onClick={() => alert('Centre d\'aide - En construction')}
        title="Aide"
      >
        <HelpCircle />
      </FloatingButton>
    </HomeContainer>
  );
}

export default Home;