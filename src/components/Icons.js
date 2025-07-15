// src/components/Icons.js - VERSION SIMPLIFIÉE ET SÛRE
import React from 'react';
import { 
  Home, User, LogOut, Menu, X, 
  Plus, Edit, Save, Trash2, 
  Search, Filter, Eye, EyeOff,
  ChevronDown, ChevronUp, ArrowLeft, ArrowRight,
  Star, Check, AlertTriangle, Info,
  Calendar, Clock, Heart, Settings,
  Share2, Download, Upload, File, Image,
  RotateCw, Sun, Moon
} from 'lucide-react';

// Composant d'icône simple et sûr
const Icon = ({ name, size = 20, color, className = '', ...props }) => {
  const icons = {
    'home': Home,
    'user': User,
    'logout': LogOut,
    'menu': Menu,
    'close': X,
    'add': Plus,
    'plus': Plus,
    'edit': Edit,
    'save': Save,
    'delete': Trash2,
    'trash': Trash2,
    'search': Search,
    'filter': Filter,
    'view': Eye,
    'hide': EyeOff,
    'chevron-down': ChevronDown,
    'chevron-up': ChevronUp,
    'arrow-left': ArrowLeft,
    'arrow-right': ArrowRight,
    'star': Star,
    'check': Check,
    'success': Check,
    'warning': AlertTriangle,
    'alert': AlertTriangle,
    'info': Info,
    'calendar': Calendar,
    'time': Clock,
    'clock': Clock,
    'heart': Heart,
    'settings': Settings,
    'share': Share2,
    'download': Download,
    'upload': Upload,
    'file': File,
    'image': Image,
    'refresh': RotateCw,
    'light-mode': Sun,
    'dark-mode': Moon,
    'stethoscope': Heart, // Fallback vers heart si stethoscope n'existe pas
    'checklist': File,
    'folder': File,
    'folder-open': File,
    'book-open': File,
    'document': File,
    'help': Info
  };

  const IconComponent = icons[name];
  
  if (!IconComponent) {
    console.warn(`Icône "${name}" non trouvée, utilisation de l'icône par défaut`);
    return React.createElement(Info, { size, color, className, ...props });
  }
  
  return React.createElement(IconComponent, { size, color, className, ...props });
};

// Composant IconWithText simplifié
export const IconWithText = ({ 
  iconName, 
  children, 
  iconSize = 16, 
  spacing = '0.5rem',
  iconPosition = 'left',
  ...props 
}) => {
  const iconElement = <Icon name={iconName} size={iconSize} />;
  
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: spacing }} {...props}>
      {iconPosition === 'left' && iconElement}
      {children}
      {iconPosition === 'right' && iconElement}
    </span>
  );
};

// Composant StatusIcon simplifié
export const StatusIcon = ({ status, size = 16, ...props }) => {
  const statusMap = {
    success: { name: 'check', color: '#10B981' },
    error: { name: 'alert', color: '#EF4444' },
    warning: { name: 'warning', color: '#F59E0B' },
    info: { name: 'info', color: '#3B82F6' },
    loading: { name: 'refresh', color: '#6B7280' }
  };
  
  const config = statusMap[status] || statusMap.info;
  
  return <Icon name={config.name} size={size} color={config.color} {...props} />;
};

export default Icon;

// Export des icônes courantes pour usage direct
export {
  Home, User, LogOut, Menu, X, Plus, Edit, Save, Trash2,
  Search, Filter, Eye, EyeOff, Star, Check, AlertTriangle,
  ChevronDown, ChevronUp, ArrowLeft, ArrowRight, File, Image,
  Calendar, Clock, Heart, Settings, Share2, Download, Upload
};