// models/Questionnaire.js - Modèle complet avec système de notation
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
  links: {
    type: Map,
    of: [{
      content: String,
      title: String,
      date: {
        type: Date,
        default: Date.now
      }
    }],
    default: new Map()
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
  
  // NOUVEAUX CHAMPS POUR LE SYSTÈME DE NOTATION
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
      // Convertir les Maps en objets lors de la sérialisation JSON
      if (ret.links instanceof Map) {
        ret.links = Object.fromEntries(ret.links);
      }
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Convertir les Maps en objets lors de la conversion en objet
      if (ret.links instanceof Map) {
        ret.links = Object.fromEntries(ret.links);
      }
      return ret;
    }
  }
});

// Index pour optimiser les requêtes
questionnaireSchema.index({ user: 1 });
questionnaireSchema.index({ public: 1 });
questionnaireSchema.index({ tags: 1 });
questionnaireSchema.index({ averageRating: -1 });
questionnaireSchema.index({ views: -1 });
questionnaireSchema.index({ copies: -1 });
questionnaireSchema.index({ createdAt: -1 });
questionnaireSchema.index({ updatedAt: -1 });

// Index composé pour les questionnaires publics populaires
questionnaireSchema.index({ public: 1, averageRating: -1, views: -1 });

// Index pour la recherche textuelle
questionnaireSchema.index({ title: 'text' });

// NOUVELLE MÉTHODE : Vérifier si le questionnaire est populaire
questionnaireSchema.methods.isPopular = function() {
  return this.copies > 10 || this.views > 100;
};

// NOUVELLE MÉTHODE : Obtenir les statistiques du questionnaire
questionnaireSchema.methods.getStats = function() {
  return {
    averageRating: this.averageRating,
    ratingsCount: this.ratingsCount,
    views: this.views,
    copies: this.copies,
    isPopular: this.isPopular()
  };
};

// NOUVELLE MÉTHODE : Estimer le temps de completion
questionnaireSchema.methods.getEstimatedTime = function() {
  const questionCount = this.questions ? this.questions.length : 0;
  const estimatedMinutes = Math.max(2, Math.ceil(questionCount * 0.5));
  return `~${estimatedMinutes} min`;
};

// NOUVELLE MÉTHODE : Obtenir la note en étoiles (conversion 0-10 vers 0-5)
questionnaireSchema.methods.getStarsRating = function() {
  return Math.round(this.averageRating / 2);
};

// NOUVELLE MÉTHODE : Incrémenter les vues
questionnaireSchema.methods.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

// NOUVELLE MÉTHODE : Incrémenter les copies
questionnaireSchema.methods.incrementCopies = async function() {
  this.copies += 1;
  return await this.save();
};

// NOUVELLE MÉTHODE : Obtenir l'icône basée sur les tags
questionnaireSchema.methods.getIcon = function() {
  if (!this.tags || this.tags.length === 0) return '📋';
  
  const tags = this.tags.map(tag => tag.toLowerCase());
  
  if (tags.some(tag => ['irm', 'mri'].includes(tag))) return '🧲';
  if (tags.some(tag => ['tdm', 'ct', 'scanner'].includes(tag))) return '🔍';
  if (tags.some(tag => ['rx', 'radio', 'radiographie'].includes(tag))) return '🩻';
  if (tags.some(tag => ['echo', 'echographie', 'ultrasound'].includes(tag))) return '📡';
  if (tags.some(tag => ['neuro', 'neurologie', 'brain'].includes(tag))) return '🧠';
  if (tags.some(tag => ['cardio', 'coeur', 'heart'].includes(tag))) return '❤️';
  if (tags.some(tag => ['thorax', 'poumon', 'lung'].includes(tag))) return '🫁';
  if (tags.some(tag => ['abdomen', 'digestif'].includes(tag))) return '🫄';
  if (tags.some(tag => ['osteo', 'bone', 'os'].includes(tag))) return '🦴';
  
  return '📋';
};

// MÉTHODE VIRTUELLE : Compter le nombre de questions
questionnaireSchema.virtual('questionsCount').get(function() {
  return this.questions ? this.questions.length : 0;
});

// MÉTHODE VIRTUELLE : Compter le nombre de tags
questionnaireSchema.virtual('tagsCount').get(function() {
  return this.tags ? this.tags.length : 0;
});

// MÉTHODE VIRTUELLE : Vérifier si le questionnaire est complet
questionnaireSchema.virtual('isComplete').get(function() {
  return this.title && 
         this.questions && 
         this.questions.length > 0 &&
         this.questions.every(q => q.question && q.question.trim().length > 0);
});

// MÉTHODE VIRTUELLE : Obtenir un résumé du questionnaire
questionnaireSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    title: this.title,
    questionsCount: this.questionsCount,
    tagsCount: this.tagsCount,
    estimatedTime: this.getEstimatedTime(),
    isComplete: this.isComplete,
    isPublic: this.public,
    stats: this.getStats(),
    icon: this.getIcon()
  };
});

// Middleware pre-save pour validation et nettoyage
questionnaireSchema.pre('save', function(next) {
  // Nettoyer les tags vides
  if (this.tags) {
    this.tags = this.tags.filter(tag => tag && tag.trim().length > 0);
  }
  
  // Nettoyer les questions vides
  if (this.questions) {
    this.questions = this.questions.filter(q => 
      q && q.question && q.question.trim().length > 0
    );
  }
  
  // Nettoyer les hiddenQuestions invalides
  if (this.hiddenQuestions) {
    this.hiddenQuestions = this.hiddenQuestions.filter(id => 
      id && typeof id === 'string' && id.trim().length > 0
    );
  }
  
  // Valider la cohérence des données
  if (this.ratingsCount < 0) {
    this.ratingsCount = 0;
  }
  
  if (this.averageRating < 0) {
    this.averageRating = 0;
  } else if (this.averageRating > 10) {
    this.averageRating = 10;
  }
  
  if (this.views < 0) {
    this.views = 0;
  }
  
  if (this.copies < 0) {
    this.copies = 0;
  }
  
  next();
});

// Middleware post-save pour log des changements importants
questionnaireSchema.post('save', function(doc) {
  if (this.wasNew) {
    console.log(`Nouveau questionnaire créé: ${doc.title} (ID: ${doc._id})`);
  }
});

// Méthode statique pour obtenir les questionnaires populaires
questionnaireSchema.statics.getPopularQuestionnaires = function(limit = 10) {
  return this.find({ public: true })
    .sort({ views: -1, copies: -1, averageRating: -1 })
    .limit(limit)
    .populate('user', 'username')
    .lean();
};

// Méthode statique pour obtenir les questionnaires les mieux notés
questionnaireSchema.statics.getTopRatedQuestionnaires = function(limit = 10) {
  return this.find({ 
    public: true, 
    ratingsCount: { $gte: 3 } // Au moins 3 notes pour être considéré
  })
    .sort({ averageRating: -1, ratingsCount: -1 })
    .limit(limit)
    .populate('user', 'username')
    .lean();
};

// Méthode statique pour rechercher des questionnaires
questionnaireSchema.statics.searchPublicQuestionnaires = function(searchQuery, options = {}) {
  const {
    tags = [],
    modality = [],
    specialty = [],
    location = [],
    minRating = 0,
    page = 1,
    limit = 12,
    sortBy = 'createdAt'
  } = options;

  let query = { public: true };
  
  if (searchQuery && searchQuery.trim()) {
    query.title = { $regex: searchQuery.trim(), $options: 'i' };
  }
  
  // Combiner tous les filtres de tags
  const allTagFilters = [...tags, ...modality, ...specialty, ...location].filter(Boolean);
  if (allTagFilters.length > 0) {
    query.tags = { $in: allTagFilters };
  }
  
  if (minRating > 0) {
    query.averageRating = { $gte: minRating };
  }

  const sortOptions = {};
  switch (sortBy) {
    case 'popular':
      sortOptions.views = -1;
      sortOptions.copies = -1;
      break;
    case 'rating':
      sortOptions.averageRating = -1;
      sortOptions.ratingsCount = -1;
      break;
    case 'newest':
      sortOptions.createdAt = -1;
      break;
    case 'oldest':
      sortOptions.createdAt = 1;
      break;
    case 'alphabetical':
      sortOptions.title = 1;
      break;
    default:
      sortOptions.createdAt = -1;
  }

  return this.find(query)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'username')
    .lean();
};

// Méthode statique pour obtenir les tags les plus utilisés
questionnaireSchema.statics.getPopularTags = function(limit = 20) {
  return this.aggregate([
    { $match: { public: true } },
    { $unwind: '$tags' },
    { 
      $group: { 
        _id: '$tags', 
        count: { $sum: 1 } 
      } 
    },
    { $sort: { count: -1 } },
    { $limit: limit },
    { 
      $project: { 
        tag: '$_id', 
        count: 1, 
        _id: 0 
      } 
    }
  ]);
};

// Méthode statique pour obtenir les statistiques globales
questionnaireSchema.statics.getGlobalStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalQuestionnaires: { $sum: 1 },
        publicQuestionnaires: { 
          $sum: { $cond: ['$public', 1, 0] } 
        },
        totalViews: { $sum: '$views' },
        totalCopies: { $sum: '$copies' },
        averageRating: { $avg: '$averageRating' },
        totalRatings: { $sum: '$ratingsCount' }
      }
    }
  ]);
};

const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);

module.exports = Questionnaire;