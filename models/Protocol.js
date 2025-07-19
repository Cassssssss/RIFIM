const mongoose = require('mongoose');

// Schéma pour une séquence ou temps d'acquisition
const SequenceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  justification: {
    type: String,
    required: true // Chaque séquence doit être justifiée
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

// Schéma pour les paramètres d'acquisition généralx
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

// Schéma principal du protocole
const ProtocolSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  // Classification du protocole
  imagingType: {
    type: String,
    required: true,
    enum: ['IRM', 'Scanner', 'Échographie', 'Radiographie', 'Mammographie', 'Médecine Nucléaire', 'Angiographie']
  },
  
  anatomicalRegion: {
    type: String,
    required: true,
    enum: [
      'Céphalée', 'Cervical', 'Thorax', 'Abdomen', 'Pelvis', 
      'Rachis', 'Membre Supérieur', 'Membre Inférieur', 
      'Vaisseaux', 'Cœur', 'Sein', 'Autre'
    ]
  },
  
  // Indication clinique
  indication: {
    type: String,
    required: true,
    trim: true
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
    required: true
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
  
  // Commentaires et évaluations
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: { type: Date, default: Date.now }
  }]
  
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

// Index pour améliorer les performances de recherche
ProtocolSchema.index({ imagingType: 1, anatomicalRegion: 1 });
ProtocolSchema.index({ user: 1 });
ProtocolSchema.index({ public: 1 });
ProtocolSchema.index({ tags: 1 });
ProtocolSchema.index({ title: 'text', description: 'text', indication: 'text' });

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
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  } else {
    return `${minutes}min`;
  }
};

// Méthode pour incrémenter les vues
ProtocolSchema.methods.incrementViews = function() {
  this.stats.views += 1;
  return this.save();
};

// Méthode pour ajouter une évaluation
ProtocolSchema.methods.addReview = function(userId, rating, comment) {
  this.reviews.push({
    user: userId,
    rating: rating,
    comment: comment
  });
  return this.save();
};

// Middleware pour mettre à jour la durée totale avant sauvegarde
ProtocolSchema.pre('save', function(next) {
  if (this.isModified('sequences')) {
    this.estimatedDuration = this.calculateTotalDuration();
  }
  next();
});

module.exports = mongoose.model('Protocol', ProtocolSchema);