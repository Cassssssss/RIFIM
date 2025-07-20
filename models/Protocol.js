const mongoose = require('mongoose');

// Schéma pour une séquence ou temps d'acquisition
const SequenceSchema = new mongoose.Schema({
  id: {
    type: String,
    // ✅ SUPPRIMÉ : required: true
  },
  name: {
    type: String,
    // ✅ SUPPRIMÉ : required: true
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  justification: {
    type: String,
    // ✅ SUPPRIMÉ : required: true // Chaque séquence doit être justifiée
    default: ''
  },
  technicalParameters: {
    type: Object, // Paramètres techniques (TR, TE, épaisseur de coupe, etc.)
    default: {}
  },
  order: {
    type: Number,
    default: 0 // Ordre d'exécution des séquences
  },
  duration: {
    type: String, // Durée estimée (ex: "3min 30s")
    default: ''
  }
});

// Schéma pour les paramètres d'acquisition généraux
const AcquisitionParametersSchema = new mongoose.Schema({
  fieldStrength: String,        // Force du champ magnétique (ex: "1.5T", "3T")
  coil: String,                 // Antenne utilisée (ex: "Antenne tête 32 canaux")
  position: String,             // Position du patient (ex: "Décubitus dorsal")
  contrast: {
    used: { type: Boolean, default: false },
    agent: String,              // Agent de contraste utilisé
    dose: String,               // Dosage
    injectionProtocol: String   // Protocole d'injection
  },
  preparation: {
    type: String,
    default: ''                 // Instructions de préparation patient
  }
});

// Schéma pour les notes/évaluations - NOUVEAU SYSTÈME DE NOTATION
const RatingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
    validate: {
      validator: function(value) {
        // Vérifier que la note est un multiple de 0.5
        return (value * 2) % 1 === 0;
      },
      message: 'La note doit être un multiple de 0.5 (ex: 3.5, 7.0, 9.5)'
    }
  },
  comment: {
    type: String,
    default: '',
    maxlength: 500
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Schéma principal du protocole
const ProtocolSchema = new mongoose.Schema({
  title: {
    type: String,
    // ✅ SUPPRIMÉ : required: true,
    trim: true,
    default: 'Protocole sans titre'
  },
  
  // Classification du protocole
  imagingType: {
    type: String,
    // ✅ SUPPRIMÉ : required: true,
    enum: ['IRM', 'Scanner', 'Échographie', 'Radiographie', 'Mammographie', 'Médecine Nucléaire', 'Angiographie'],
    default: ''
  },
  
  anatomicalRegion: {
    type: String,
    // ✅ SUPPRIMÉ : required: true,
    enum: [
      'Céphalée', 'Cervical', 'Thorax', 'Abdomen', 'Pelvis', 
      'Rachis', 'Membre Supérieur', 'Membre Inférieur', 
      'Vaisseaux', 'Cœur', 'Sein', 'Autre'
    ],
    default: ''
  },
  
  // Indication clinique
  indication: {
    type: String,
    // ✅ SUPPRIMÉ : required: true,
    trim: true,
    default: ''
  },
  
  // Description générale du protocole
  description: {
    type: String,
    default: ''
  },
  
  // Séquences/Temps d'acquisition avec justifications
  sequences: [SequenceSchema],
  
  // Paramètres d'acquisition généraux
  acquisitionParameters: AcquisitionParametersSchema,
  
  // Contre-indications
  contraindications: [{
    type: String,
    trim: true
  }],
  
  // Avantages de ce protocole
  advantages: [{
    type: String,
    trim: true
  }],
  
  // Limitations/Inconvénients
  limitations: [{
    type: String,
    trim: true
  }],
  
  // Durée totale estimée
  estimatedDuration: {
    type: String,
    default: ''
  },
  
  // Coût estimé (optionnel)
  estimatedCost: {
    type: String,
    default: ''
  },
  
  // Références bibliographiques
  references: [{
    title: String,
    authors: String,
    journal: String,
    year: Number,
    url: String
  }],
  
  // Propriétaire du protocole
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // ← GARDÉ car nécessaire pour la sécurité
  },
  
  // Visibilité publique
  public: {
    type: Boolean,
    default: false
  },
  
  // Tags pour la recherche et filtrage
  tags: [{
    type: String,
    trim: true
  }],
  
  // Niveau de difficulté/complexité
  complexity: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  
  // Statut du protocole
  status: {
    type: String,
    enum: ['Brouillon', 'Validé', 'En révision'],
    default: 'Brouillon'
  },
  
  // Version du protocole
  version: {
    type: String,
    default: '1.0'
  },
  
  // Historique des modifications
  changelog: [{
    version: String,
    date: { type: Date, default: Date.now },
    changes: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Statistiques d'utilisation
  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    copies: { type: Number, default: 0 }
  },
  
  // NOUVEAU SYSTÈME DE NOTATION - Remplace l'ancien système reviews
  ratings: [RatingSchema],
  
  // Moyenne des notes calculée automatiquement
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  
  // Nombre total de notes
  ratingsCount: {
    type: Number,
    default: 0
  }
  
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

// Index pour améliorer les performances de recherche
ProtocolSchema.index({ imagingType: 1, anatomicalRegion: 1 });
ProtocolSchema.index({ user: 1 });
ProtocolSchema.index({ public: 1 });
ProtocolSchema.index({ tags: 1 });
ProtocolSchema.index({ averageRating: -1 }); // Index pour trier par note
ProtocolSchema.index({ ratingsCount: -1 }); // Index pour trier par popularité
ProtocolSchema.index({ title: 'text', description: 'text', indication: 'text' });
ProtocolSchema.index({ 'ratings.user': 1 }); // Index pour vérifier si un utilisateur a déjà noté

// Méthode pour calculer la durée totale automatiquement
ProtocolSchema.methods.calculateTotalDuration = function() {
  let totalMinutes = 0;
  
  this.sequences.forEach(sequence => {
    if (sequence.duration) {
      // Parse duration like "3min 30s" or "5min"
      const durationMatch = sequence.duration.match(/(\d+)min(?:\s*(\d+)s)?/);
      if (durationMatch) {
        totalMinutes += parseInt(durationMatch[1]);
        if (durationMatch[2]) {
          totalMinutes += parseInt(durationMatch[2]) / 60;
        }
      }
    }
  });
  
  if (totalMinutes === 0) return 'Non spécifiée';
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? minutes + 'min' : ''}`;
  } else {
    return `${minutes}min`;
  }
};

// Méthode pour recalculer les statistiques de notation
ProtocolSchema.methods.updateRatingStats = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.ratingsCount = 0;
    return;
  }
  
  const total = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
  this.averageRating = Number((total / this.ratings.length).toFixed(1));
  this.ratingsCount = this.ratings.length;
};

// Middleware pour recalculer les stats avant sauvegarde
ProtocolSchema.pre('save', function(next) {
  // Recalculer la durée estimée
  if (this.sequences && this.sequences.length > 0) {
    this.estimatedDuration = this.calculateTotalDuration();
  }
  
  // Recalculer les stats de notation si nécessaire
  if (this.ratings && this.ratings.length > 0) {
    this.updateRatingStats();
  }
  
  next();
});

module.exports = mongoose.model('Protocol', ProtocolSchema);