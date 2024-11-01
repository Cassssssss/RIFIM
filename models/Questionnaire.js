const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  id: String,
  text: String,
  image: {
    src: String,
    caption: String
  },
  includeInConclusion: {  // Ajout de cet attribut
    type: Boolean,
    default: false
  },
  subQuestions: [/* Définition récursive du schéma de question */]
});


const QuestionSchema = new mongoose.Schema({
  id: String,
  text: String,
  type: String,
  page: { type: Number, default: 1 },
  isImportantToCheck: { // Ajoutez cette ligne
    type: Boolean,
    default: false
  },
  image: {
    src: String,
    caption: String
  },
  questionImage: {
    src: String,
    areas: [{
      type: { type: String, enum: ['polygon', 'rectangle'] },
      points: [{
        x: Number,
        y: Number
      }],
      text: String,
      crText: String,
      color: String // Ajoute cette ligne
    }]
  },
  options: [OptionSchema],
  isImportantToCheck: {
    type: Boolean,
    default: false
  }
});

const QuestionnaireSchema = new mongoose.Schema({
  title: String,
  questions: [QuestionSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  selectedOptions: mongoose.Schema.Types.Mixed,
  crData: {
    crTexts: mongoose.Schema.Types.Mixed,
    freeTexts: mongoose.Schema.Types.Mixed
  },
  hiddenQuestions: {
    type: Map,
    of: Boolean,
    default: {}
  },
  pageTitles: {  // Ajoutez ce champ
    type: Object,
    default: {}
  },
  links: {
    type: Map,
    of: [{
      content: String,
      title: String,
      date: { type: Date, default: Date.now }
    }],
    default: () => new Map()  // Modification ici
  },
  public: { type: Boolean, default: false },
  tags: [String],
  modality: String,
  specialty: String
}, { timestamps: true });

module.exports = mongoose.model('Questionnaire', QuestionnaireSchema);