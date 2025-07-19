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

// NOUVELLE MÉTHODE : Ajouter ou mettre à jour une note
ProtocolSchema.methods.addOrUpdateRating = function(userId, rating, comment = '') {
  // Valider la note (0 à 10, multiples de 0.5)
  if (rating < 0 || rating > 10 || (rating * 2) % 1 !== 0) {
    throw new Error('La note doit être entre 0 et 10 avec des incréments de 0.5');
  }

  // Vérifier si l'utilisateur a déjà noté ce protocole
  const existingRatingIndex = this.ratings.findIndex(
    r => r.user.toString() === userId.toString()
  );

  if (existingRatingIndex !== -1) {
    // Mettre à jour la note existante
    this.ratings[existingRatingIndex].rating = rating;
    this.ratings[existingRatingIndex].comment = comment;
    this.ratings[existingRatingIndex].date = new Date();
  } else {
    // Ajouter une nouvelle note
    this.ratings.push({
      user: userId,
      rating: rating,
      comment: comment
    });
  }

  // Recalculer la moyenne et le nombre de notes
  this.calculateAverageRating();
  
  return this.save();
};

// NOUVELLE MÉTHODE : Supprimer une note
ProtocolSchema.methods.removeRating = function(userId) {
  const initialLength = this.ratings.length;
  this.ratings = this.ratings.filter(r => r.user.toString() !== userId.toString());
  
  if (this.ratings.length < initialLength) {
    this.calculateAverageRating();
    return this.save();
  }
  
  return Promise.resolve(this);
};

// NOUVELLE MÉTHODE : Calculer la moyenne des notes
ProtocolSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.ratingsCount = 0;
  } else {
    const sum = this.ratings.reduce((total, rating) => total + rating.rating, 0);
    this.averageRating = Math.round((sum / this.ratings.length) * 2) / 2; // Arrondir au 0.5 le plus proche
    this.ratingsCount = this.ratings.length;
  }
};

// NOUVELLE MÉTHODE : Obtenir la note d'un utilisateur spécifique
ProtocolSchema.methods.getUserRating = function(userId) {
  const userRating = this.ratings.find(r => r.user.toString() === userId.toString());
  return userRating ? userRating.rating : null;
};

// NOUVELLE MÉTHODE : Vérifier si un utilisateur a déjà noté
ProtocolSchema.methods.hasUserRated = function(userId) {
  return this.ratings.some(r => r.user.toString() === userId.toString());
};

// Méthode pour ajouter une évaluation (ancienne méthode - maintenant dépréciée)
ProtocolSchema.methods.addReview = function(userId, rating, comment) {
  console.warn('addReview est déprécié, utilisez addOrUpdateRating à la place');
  return this.addOrUpdateRating(userId, rating, comment);
};

// Middleware pour mettre à jour la durée totale et recalculer les notes avant sauvegarde
ProtocolSchema.pre('save', function(next) {
  if (this.isModified('sequences')) {
    this.estimatedDuration = this.calculateTotalDuration();
  }
  
  if (this.isModified('ratings')) {
    this.calculateAverageRating();
  }
  
  next();
});

// Méthode statique pour obtenir les protocoles les mieux notés
ProtocolSchema.statics.getTopRated = function(limit = 10) {
  return this.find({ 
    public: true, 
    ratingsCount: { $gte: 3 } // Au moins 3 notes pour être considéré
  })
  .sort({ averageRating: -1, ratingsCount: -1 })
  .limit(limit)
  .populate('user', 'username');
};

// Méthode statique pour obtenir les protocoles par note
ProtocolSchema.statics.getByRatingRange = function(minRating, maxRating) {
  return this.find({
    public: true,
    averageRating: { $gte: minRating, $lte: maxRating }
  })
  .sort({ averageRating: -1 })
  .populate('user', 'username');
};

module.exports = mongoose.model('Protocol', ProtocolSchema);