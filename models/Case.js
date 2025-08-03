// models/Case.js - Modèle complet avec système de notation ET clinicalInfo
const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
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
  folders: [{
    type: String,
    trim: true
  }],
  images: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  mainImage: {
    type: String,
    trim: true
  },
  folderMainImages: {
    type: Map,
    of: String,
    default: new Map()
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  answer: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  // 🆕 NOUVEAU CHAMP : Informations cliniques du patient
  clinicalInfo: {
    type: String,
    trim: true,
    maxlength: 2000,
    default: ''
  },
  sheet: {
    type: String,
    trim: true
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
      if (ret.folderMainImages instanceof Map) {
        ret.folderMainImages = Object.fromEntries(ret.folderMainImages);
      }
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Convertir les Maps en objets lors de la conversion en objet
      if (ret.folderMainImages instanceof Map) {
        ret.folderMainImages = Object.fromEntries(ret.folderMainImages);
      }
      return ret;
    }
  }
});

// Index pour optimiser les requêtes
caseSchema.index({ user: 1 });
caseSchema.index({ public: 1 });
caseSchema.index({ tags: 1 });
caseSchema.index({ difficulty: 1 });
caseSchema.index({ averageRating: -1 });
caseSchema.index({ views: -1 });
caseSchema.index({ copies: -1 });
caseSchema.index({ createdAt: -1 });

// Index composé pour les cas publics populaires
caseSchema.index({ public: 1, averageRating: -1, views: -1 });

// NOUVELLE MÉTHODE : Vérifier si le cas est populaire
caseSchema.methods.isPopular = function() {
  return this.copies > 5 || this.views > 50;
};

// NOUVELLE MÉTHODE : Obtenir les statistiques du cas
caseSchema.methods.getStats = function() {
  return {
    totalImages: this.images ? Object.values(this.images).reduce((total, folderImages) => {
      return total + (Array.isArray(folderImages) ? folderImages.length : 0);
    }, 0) : 0,
    totalFolders: this.folders ? this.folders.length : 0,
    isPopular: this.isPopular(),
    engagement: this.views + (this.copies * 2) + (this.ratingsCount * 3)
  };
};

// MÉTHODE VIRTUELLE : Calculer le nombre total d'images
caseSchema.virtual('totalImages').get(function() {
  if (!this.images) return 0;
  return Object.values(this.images).reduce((total, folderImages) => {
    return total + (Array.isArray(folderImages) ? folderImages.length : 0);
  }, 0);
});

// MÉTHODE VIRTUELLE : Obtenir un résumé des tags
caseSchema.virtual('tagsCount').get(function() {
  return this.tags ? this.tags.length : 0;
});

// Middleware pre-save pour validation et nettoyage
caseSchema.pre('save', function(next) {
  // Nettoyer les tags vides
  if (this.tags) {
    this.tags = this.tags.filter(tag => tag && tag.trim().length > 0);
  }
  
  // Nettoyer les dossiers vides
  if (this.folders) {
    this.folders = this.folders.filter(folder => folder && folder.trim().length > 0);
  }
  
  // 🆕 NETTOYAGE : Nettoyer les infos cliniques
  if (this.clinicalInfo) {
    this.clinicalInfo = this.clinicalInfo.trim();
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
caseSchema.post('save', function(doc) {
  if (this.wasNew) {
    console.log(`Nouveau cas créé: ${doc.title} (ID: ${doc._id})`);
  }
});

// Méthode statique pour obtenir les cas populaires
caseSchema.statics.getPopularCases = function(limit = 10) {
  return this.find({ public: true })
    .sort({ views: -1, copies: -1, averageRating: -1 })
    .limit(limit)
    .populate('user', 'username')
    .lean();
};

// Méthode statique pour obtenir les cas les mieux notés
caseSchema.statics.getTopRatedCases = function(limit = 10) {
  return this.find({ 
    public: true, 
    ratingsCount: { $gte: 3 } // Au moins 3 notes pour être considéré
  })
    .sort({ averageRating: -1, ratingsCount: -1 })
    .limit(limit)
    .populate('user', 'username')
    .lean();
};

// Méthode statique pour rechercher des cas
caseSchema.statics.searchPublicCases = function(searchQuery, options = {}) {
  const {
    tags = [],
    minDifficulty = 1,
    maxDifficulty = 5,
    minRating = 0,
    page = 1,
    limit = 12,
    sortBy = 'createdAt'
  } = options;

  let query = { public: true };
  
  if (searchQuery && searchQuery.trim()) {
    query.title = { $regex: searchQuery.trim(), $options: 'i' };
  }
  
  if (tags.length > 0) {
    query.tags = { $in: tags };
  }
  
  if (minDifficulty || maxDifficulty) {
    query.difficulty = {
      $gte: minDifficulty,
      $lte: maxDifficulty
    };
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

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;