// src/components/Icons.js
import React from 'react';
import { 
  // Navigation et interface
  Home, User, LogOut, Menu, X, ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MoreHorizontal,
  
  // Actions principales
  Plus, Edit, Save, Copy, Trash2, Download, Upload, Search, Filter,
  Settings, RotateCw, Share2, ExternalLink, Eye, EyeOff,
  
  // Contenu et médias
  File, FileText, Image, Video, Camera, Mic, FileImage, Folder, FolderOpen,
  Link, Paperclip, BookOpen, Book, Newspaper, FileCheck,
  
  // Statut et feedback
  Check, X as XIcon, AlertTriangle, AlertCircle, Info, HelpCircle,
  Star, Heart, ThumbsUp, Flag, Shield, Lock, Unlock,
  
  // Communication et social
  Mail, MessageCircle, Phone, Bell, BellOff, Send, Reply,
  
  // Mode sombre et thème
  Sun, Moon, Palette,
  
  // Médical spécifique
  Stethoscope, Activity, HeartPulse, Pill, UserCheck, UserX,
  ClipboardList, Calendar, Clock, MapPin, Target,
  
  // Drag & Drop et organisation
  GripVertical, Move, RotateCcw, Maximize, Minimize,
  
  // Données et analytiques
  BarChart, PieChart, TrendingUp, TrendingDown, Database,
  
  // Système
  Wifi, WifiOff, Power, Battery, Signal, Volume2, VolumeX
} from 'lucide-react';

// Tailles standardisées pour les icônes médicales
export const ICON_SIZES = {
  xs: 12,     // Très petit (badges, indicateurs)
  sm: 16,     // Petit (boutons compacts, listes)
  md: 20,     // Moyen (boutons normaux)
  lg: 24,     // Grand (titres, headers)
  xl: 32,     // Très grand (icônes principales)
  xxl: 48     // Énorme (logos, splash screens)
};

// Wrapper pour standardiser les icônes avec des props cohérentes
export const Icon = ({ 
  name, 
  size = 'md', 
  color,
  className = '',
  ...props 
}) => {
  const IconComponent = ICON_MAP[name];
  const iconSize = typeof size === 'number' ? size : ICON_SIZES[size];
  
  if (!IconComponent) {
    console.warn(`Icône "${name}" non trouvée`);
    return <HelpCircle size={iconSize} className={className} {...props} />;
  }
  
  return (
    <IconComponent 
      size={iconSize} 
      color={color}
      className={className}
      {...props} 
    />
  );
};

// Map de toutes les icônes disponibles
const ICON_MAP = {
  // === NAVIGATION ET INTERFACE ===
  'home': Home,
  'user': User,
  'logout': LogOut,
  'menu': Menu,
  'close': X,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'more': MoreHorizontal,
  
  // === ACTIONS PRINCIPALES ===
  'add': Plus,
  'plus': Plus,
  'edit': Edit,
  'save': Save,
  'copy': Copy,
  'delete': Trash2,
  'trash': Trash2,
  'download': Download,
  'upload': Upload,
  'search': Search,
  'filter': Filter,
  'settings': Settings,
  'refresh': RotateCw,
  'share': Share2,
  'external-link': ExternalLink,
  'view': Eye,
  'hide': EyeOff,
  
  // === CONTENU ET MÉDIAS ===
  'file': File,
  'document': FileText,
  'image': Image,
  'video': Video,
  'camera': Camera,
  'microphone': Mic,
  'photo': FileImage,
  'folder': Folder,
  'folder-open': FolderOpen,
  'link': Link,
  'attachment': Paperclip,
  'book-open': BookOpen,
  'book': Book,
  'news': Newspaper,
  'file-check': FileCheck,
  
  // === STATUT ET FEEDBACK ===
  'check': Check,
  'success': Check,
  'error': XIcon,
  'warning': AlertTriangle,
  'alert': AlertCircle,
  'info': Info,
  'help': HelpCircle,
  'star': Star,
  'favorite': Heart,
  'like': ThumbsUp,
  'flag': Flag,
  'secure': Shield,
  'lock': Lock,
  'unlock': Unlock,
  
  // === COMMUNICATION ===
  'mail': Mail,
  'message': MessageCircle,
  'phone': Phone,
  'notification': Bell,
  'notification-off': BellOff,
  'send': Send,
  'reply': Reply,
  
  // === THÈME ===
  'light-mode': Sun,
  'dark-mode': Moon,
  'theme': Palette,
  
  // === MÉDICAL SPÉCIFIQUE ===
  'stethoscope': Stethoscope,
  'activity': Activity,
  'heart-rate': HeartPulse,
  'medication': Pill,
  'patient-ok': UserCheck,
  'patient-no': UserX,
  'checklist': ClipboardList,
  'calendar': Calendar,
  'time': Clock,
  'location': MapPin,
  'target': Target,
  
  // === DRAG & DROP ===
  'grip': GripVertical,
  'move': Move,
  'rotate-left': RotateCcw,
  'rotate-right': RotateCw,
  'maximize': Maximize,
  'minimize': Minimize,
  
  // === DONNÉES ===
  'chart-bar': BarChart,
  'chart-pie': PieChart,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'database': Database,
  
  // === SYSTÈME ===
  'wifi': Wifi,
  'wifi-off': WifiOff,
  'power': Power,
  'battery': Battery,
  'signal': Signal,
  'volume': Volume2,
  'volume-off': VolumeX
};

// === COMPOSANTS D'ICÔNES SPÉCIALISÉS ===

// Icône avec texte pour les boutons
export const IconWithText = ({ 
  iconName, 
  children, 
  iconSize = 'sm', 
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

// Icône de statut avec couleur automatique
export const StatusIcon = ({ status, size = 'sm', ...props }) => {
  const statusMap = {
    success: { name: 'check', color: '#10B981' },
    error: { name: 'error', color: '#EF4444' },
    warning: { name: 'warning', color: '#F59E0B' },
    info: { name: 'info', color: '#3B82F6' },
    loading: { name: 'refresh', color: '#6B7280' }
  };
  
  const config = statusMap[status] || statusMap.info;
  
  return <Icon name={config.name} size={size} color={config.color} {...props} />;
};

// Icône d'action avec hover
export const ActionIcon = ({ 
  name, 
  onClick, 
  size = 'md',
  hoverColor = '#3B82F6',
  className = '',
  ...props 
}) => {
  return (
    <Icon 
      name={name} 
      size={size}
      onClick={onClick}
      className={`cursor-pointer transition-colors hover:text-blue-500 ${className}`}
      style={{ cursor: 'pointer' }}
      {...props}
    />
  );
};

// Export des icônes les plus utilisées pour un accès direct
export {
  Home, User, LogOut, Menu, X, Plus, Edit, Save, Trash2, 
  Search, Filter, Eye, EyeOff, Star, Check, AlertTriangle,
  ChevronDown, ChevronUp, ArrowLeft, ArrowRight, File, Image,
  Calendar, Clock, Heart, Settings, Share2, Download, Upload
};

export default Icon;