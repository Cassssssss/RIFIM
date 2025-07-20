// models/CaseRating.js
const mongoose = require('mongoose');

const caseRatingSchema = new mongoose.Schema({
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  comment: {
    type: String,
    maxlength: 500,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour éviter les doublons de notation par utilisateur/cas
caseRatingSchema.index({ case: 1, user: 1 }, { unique: true });

const CaseRating = mongoose.model('CaseRating', caseRatingSchema);

module.exports = CaseRating;