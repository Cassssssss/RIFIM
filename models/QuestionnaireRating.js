// models/QuestionnaireRating.js
const mongoose = require('mongoose');

const questionnaireRatingSchema = new mongoose.Schema({
  questionnaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Questionnaire',
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

// Index pour éviter les doublons de notation par utilisateur/questionnaire
questionnaireRatingSchema.index({ questionnaire: 1, user: 1 }, { unique: true });

const QuestionnaireRating = mongoose.model('QuestionnaireRating', questionnaireRatingSchema);

module.exports = QuestionnaireRating;