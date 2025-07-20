// models/Questionnaire.js - Modèle complet CORRIGÉ avec objets au lieu de Maps
const mongoose = require('mongoose');

const questionnaireSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    type: mongoose.Schema.Types.Mixed
  }],
  selectedOptions: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  crData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  hiddenQuestions: {
    type: [String],
    default: []
  },
  pageTitles: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // ✅ CORRECTION CRITIQUE : Utiliser un objet au lieu d'une Map
  links: {
    type: mongoose.Schema.Types.Mixed,
    default: {} // ← CHANGÉ : {} au lieu de new Map()
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  public: {
    type: Boolean,
    default: false
  },
  
  // CHAMPS POUR LE SYSTÈME DE NOTATION
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
    validate: {
      validator: function(value) {
        return value >= 0 && value <= 10;
      },
      message: 'La note moyenne doit être comprise entre 0 et 10'
    }
  },
  ratingsCount: {
    type: Number,
    default: 0,
    min: 0,
    validate: {
      validator: function(value) {
        return Number.isInteger(value) && value >= 0;
      },
      message: 'Le nombre de notes doit être un entier positif'
    }
  },
  views: {
    type: Number,
    default: 0,
    min: 0,
    validate: {
      validator: function(value) {
        return Number.isInteger(value) && value >= 0;
      },
      message: 'Le nombre de vues doit être un entier positif'
    }
  },
  copies: {
    type: Number,
    default: 0,
    min: 0,
    validate: {
      validator: function(value) {
        return Number.isInteger(value) && value >= 0;
      },
      message: 'Le nombre de copies doit être un entier positif'
    }
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // ✅ CORRECTION : Plus besoin de convertir les Maps puisqu'on utilise des objets
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      // ✅ CORRECTION : Plus besoin de convertir les Maps puisqu'on utilise des objets
      return ret;
    }
  }
});

// Index pour améliorer les performances
questionnaireSchema.index({ user: 1, createdAt: -1 });
questionnaireSchema.index({ public: 1, createdAt: -1 });
questionnaireSchema.index({ tags: 1 });
questionnaireSchema.index({ averageRating: -1 });
questionnaireSchema.index({ views: -1 });

// Virtual pour obtenir le nombre de questions
questionnaireSchema.virtual('questionCount').get(function() {
  return this.questions ? this.questions.length : 0;
});

// Virtual pour vérifier si le questionnaire a des liens
questionnaireSchema.virtual('hasLinks').get(function() {
  return this.links && Object.keys(this.links).length > 0;
});

// Middleware pre-save pour valider les données
questionnaireSchema.pre('save', function(next) {
  // ✅ CORRECTION : S'assurer que links est toujours un objet
  if (!this.links || typeof this.links !== 'object') {
    this.links = {};
  }
  
  // S'assurer que les autres champs sont bien initialisés
  if (!this.selectedOptions || typeof this.selectedOptions !== 'object') {
    this.selectedOptions = {};
  }
  
  if (!this.crData || typeof this.crData !== 'object') {
    this.crData = { crTexts: {}, freeTexts: {} };
  }
  
  if (!this.pageTitles || typeof this.pageTitles !== 'object') {
    this.pageTitles = {};
  }
  
  if (!Array.isArray(this.hiddenQuestions)) {
    this.hiddenQuestions = [];
  }
  
  if (!Array.isArray(this.tags)) {
    this.tags = [];
  }
  
  // Valider que les notes sont dans la plage correcte
  if (this.averageRating < 0 || this.averageRating > 10) {
    this.averageRating = 0;
  }
  
  if (this.ratingsCount < 0) {
    this.ratingsCount = 0;
  }
  
  if (this.views < 0) {
    this.views = 0;
  }
  
  if (this.copies < 0) {
    this.copies = 0;
  }
  
  next();
});

// Méthode pour ajouter une note
questionnaireSchema.methods.addRating = function(rating) {
  if (rating < 0 || rating > 10) {
    throw new Error('La note doit être comprise entre 0 et 10');
  }
  
  const totalRating = (this.averageRating * this.ratingsCount) + rating;
  this.ratingsCount += 1;
  this.averageRating = Math.round((totalRating / this.ratingsCount) * 100) / 100;
  
  return this.save();
};

// Méthode pour mettre à jour une note existante
questionnaireSchema.methods.updateRating = function(oldRating, newRating) {
  if (newRating < 0 || newRating > 10) {
    throw new Error('La note doit être comprise entre 0 et 10');
  }
  
  if (this.ratingsCount === 0) {
    throw new Error('Aucune note à mettre à jour');
  }
  
  const totalRating = (this.averageRating * this.ratingsCount) - oldRating + newRating;
  this.averageRating = Math.round((totalRating / this.ratingsCount) * 100) / 100;
  
  return this.save();
};

// Méthode pour supprimer une note
questionnaireSchema.methods.removeRating = function(rating) {
  if (this.ratingsCount === 0) {
    throw new Error('Aucune note à supprimer');
  }
  
  if (this.ratingsCount === 1) {
    this.averageRating = 0;
    this.ratingsCount = 0;
  } else {
    const totalRating = (this.averageRating * this.ratingsCount) - rating;
    this.ratingsCount -= 1;
    this.averageRating = Math.round((totalRating / this.ratingsCount) * 100) / 100;
  }
  
  return this.save();
};

module.exports = mongoose.model('Questionnaire', questionnaireSchema);