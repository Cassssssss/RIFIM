const mongoose = require('mongoose');

const protocolRatingSchema = new mongoose.Schema({
  protocol: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Protocol',
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
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index composé pour éviter les doublons (un utilisateur ne peut noter qu'une fois le même protocole)
protocolRatingSchema.index({ protocol: 1, user: 1 }, { unique: true });

// Middleware pour mettre à jour updatedAt
protocolRatingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('ProtocolRating', protocolRatingSchema);