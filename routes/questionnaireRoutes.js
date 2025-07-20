const express = require('express');
const router = express.Router();
const Questionnaire = require('../models/Questionnaire');
const QuestionnaireRating = require('../models/QuestionnaireRating');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// Route pour récupérer tous les questionnaires de l'utilisateur connecté
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const modality = req.query.modality || '';
    const specialty = req.query.specialty || '';
    const location = req.query.location || '';

    // Construction du filtre de base
    let filter = { user: req.userId };

    // Recherche textuelle
    if (search.trim()) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Filtres par tags
    const modalityTags = modality ? modality.split(',').filter(Boolean) : [];
    const specialtyTags = specialty ? specialty.split(',').filter(Boolean) : [];
    const locationTags = location ? location.split(',').filter(Boolean) : [];

    if (modalityTags.length > 0 || specialtyTags.length > 0 || locationTags.length > 0) {
      const allTags = [...modalityTags, ...specialtyTags, ...locationTags];
      filter.tags = { $in: allTags };
    }

    const skip = (page - 1) * limit;

    // Vérifier si nous avons des questionnaires
    const total = await Questionnaire.countDocuments(filter);

    if (total === 0) {
      return res.json({
        questionnaires: [],
        currentPage: 1,
        totalPages: 0,
        totalQuestionnaires: 0
      });
    }

    const totalPages = Math.ceil(total / limit);

    const questionnaires = await Questionnaire.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // S'assurer que questionnaires est toujours un tableau
    const safeQuestionnaires = Array.isArray(questionnaires) ? questionnaires : [];

    // Ajouter les métadonnées requises par le frontend
    const questionnairesWithMetadata = safeQuestionnaires.map(questionnaire => ({
      ...questionnaire,
      averageRating: questionnaire.averageRating || 0,
      ratingsCount: questionnaire.ratingsCount || 0,
      views: questionnaire.views || 0,
      copies: questionnaire.copies || 0,
      tags: questionnaire.tags || []
    }));

    res.json({
      questionnaires: questionnairesWithMetadata,
      currentPage: page,
      totalPages,
      totalQuestionnaires: total
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des questionnaires:', error);
    res.json({
      questionnaires: [],
      currentPage: 1,
      totalPages: 0,
      totalQuestionnaires: 0
    });
  }
});

// Route pour récupérer les questionnaires publics avec pagination et filtres
router.get('/public', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const modality = req.query.modality || '';
    const specialty = req.query.specialty || '';
    const location = req.query.location || '';

    // Construction du filtre de base
    let filter = { public: true };

    // Recherche textuelle
    if (search.trim()) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Filtres par tags
    const modalityTags = modality ? modality.split(',').filter(Boolean) : [];
    const specialtyTags = specialty ? specialty.split(',').filter(Boolean) : [];
    const locationTags = location ? location.split(',').filter(Boolean) : [];

    if (modalityTags.length > 0 || specialtyTags.length > 0 || locationTags.length > 0) {
      const allTags = [...modalityTags, ...specialtyTags, ...locationTags];
      filter.tags = { $in: allTags };
    }

    const skip = (page - 1) * limit;
    const total = await Questionnaire.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const questionnaires = await Questionnaire.find(filter)
      .populate('user', 'nom prenom email') // Ajouter les infos de l'utilisateur
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // S'assurer que questionnaires est toujours un tableau
    const safeQuestionnaires = Array.isArray(questionnaires) ? questionnaires : [];

    // Ajouter les notes utilisateur si connecté
    const questionnairesWithRatings = await Promise.all(safeQuestionnaires.map(async (questionnaire) => {
      return {
        ...questionnaire,
        averageRating: questionnaire.averageRating || 0,
        ratingsCount: questionnaire.ratingsCount || 0,
        views: questionnaire.views || 0,
        copies: questionnaire.copies || 0
      };
    }));

    res.json({
      questionnaires: questionnairesWithRatings,
      currentPage: page,
      totalPages,
      totalQuestionnaires: total
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des questionnaires publics:', error);
    res.json({
      questionnaires: [], // Toujours retourner un tableau vide en cas d'erreur
      currentPage: 1,
      totalPages: 0,
      totalQuestionnaires: 0
    });
  }
});

// Route pour copier un questionnaire public
router.post('/:id/copy', authMiddleware, async (req, res) => {
  try {
    const questionnaireId = req.params.id;
    const userId = req.userId;

    // Vérifier que le questionnaire existe et est public
    const originalQuestionnaire = await Questionnaire.findById(questionnaireId);
    if (!originalQuestionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }

    if (!originalQuestionnaire.public) {
      return res.status(403).json({ message: 'Seuls les questionnaires publics peuvent être copiés' });
    }

    // Créer une copie du questionnaire pour l'utilisateur
    const newQuestionnaire = new Questionnaire({
      ...originalQuestionnaire.toObject(),
      _id: undefined,
      title: `${originalQuestionnaire.title} (copie)`,
      user: userId,
      public: false, // La copie est privée par défaut
      averageRating: 0, // Réinitialiser les notes
      ratingsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newQuestionnaire.save();

    // Incrémenter le compteur de copies du questionnaire original
    await Questionnaire.findByIdAndUpdate(questionnaireId, {
      $inc: { copies: 1 }
    });

    res.status(201).json({
      message: 'Questionnaire copié avec succès',
      id: newQuestionnaire._id,
      questionnaire: newQuestionnaire
    });

  } catch (error) {
    console.error('Erreur lors de la copie du questionnaire:', error);
    res.status(500).json({ message: 'Erreur lors de la copie du questionnaire' });
  }
});

// Ajouter un tag à un questionnaire
router.post('/:id/tags', authMiddleware, async (req, res) => {
  try {
    const { tag } = req.body;
    
    if (!tag || tag.trim() === '') {
      return res.status(400).json({ message: 'Le tag ne peut pas être vide' });
    }

    const questionnaire = await Questionnaire.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }

    const trimmedTag = tag.trim();
    
    // Vérifier si le tag existe déjà
    if (!questionnaire.tags.includes(trimmedTag)) {
      questionnaire.tags.push(trimmedTag);
      await questionnaire.save();
    }

    res.json({ tags: questionnaire.tags });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du tag:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'ajout du tag' });
  }
});

// Supprimer un tag d'un questionnaire
router.delete('/:id/tags', authMiddleware, async (req, res) => {
  try {
    const { tag: tagToRemove } = req.body;
    
    const questionnaire = await Questionnaire.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }

    // Filtrer pour retirer le tag
    questionnaire.tags = questionnaire.tags ? questionnaire.tags.filter(t => t !== tagToRemove) : [];
    await questionnaire.save();

    res.json({ tags: questionnaire.tags });
  } catch (error) {
    console.error('Erreur lors de la suppression du tag:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du tag' });
  }
});

// MODIFIÉ : Route pour créer un questionnaire avec initialisation des champs de notation
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, questions, selectedOptions, crData, hiddenQuestions } = req.body;
    
    console.log(`Création du questionnaire : ${title}`);

    const questionnaire = new Questionnaire({
      title,
      questions,
      selectedOptions,
      crData,
      hiddenQuestions,
      user: req.userId,
      links: new Map(),
      tags: [], // Initialiser avec un tableau vide
      averageRating: 0, // NOUVEAU : Initialiser les champs de notation
      ratingsCount: 0,
      views: 0,
      copies: 0
    });

    const newQuestionnaire = await questionnaire.save();
    res.status(201).json(newQuestionnaire);
  } catch (error) {
    console.error('Erreur lors de la création du questionnaire:', error);
    res.status(500).json({ message: 'Erreur lors de la création du questionnaire' });
  }
});

// MODIFIÉ : Route pour récupérer un questionnaire par ID avec gestion des vues et notes utilisateur
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de questionnaire invalide' });
    }

    const questionnaire = await Questionnaire.findOne({
      _id: req.params.id,
      $or: [
        { user: req.userId },
        { public: true }
      ]
    });
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }

    // Incrémenter le compteur de vues si c'est un questionnaire public et que ce n'est pas le propriétaire
    if (questionnaire.public && req.userId && questionnaire.user.toString() !== req.userId) {
      await Questionnaire.findByIdAndUpdate(req.params.id, {
        $inc: { views: 1 }
      });
    }

    const questionnaireObject = questionnaire.toObject();

    // Ajouter la note de l'utilisateur connecté si applicable
    if (req.userId && questionnaire.public) {
      const userRating = await QuestionnaireRating.findOne({
        questionnaire: req.params.id,
        user: req.userId
      });
      questionnaireObject.userRating = userRating ? userRating.rating : null;
    }
    
    res.json(questionnaireObject);
  } catch (error) {
    console.error('Erreur lors de la récupération du questionnaire:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du questionnaire' });
  }
});

// Route pour mettre à jour un questionnaire
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de questionnaire invalide' });
    }

    const questionnaire = await Questionnaire.findOneAndUpdate(
      { 
        _id: req.params.id, 
        user: req.userId 
      },
      req.body,
      { new: true }
    );
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }
    
    res.json(questionnaire);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du questionnaire:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du questionnaire' });
  }
});

// Route pour modifier la visibilité (public/privé)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de questionnaire invalide' });
    }

    const questionnaire = await Questionnaire.findOneAndUpdate(
      { 
        _id: req.params.id, 
        user: req.userId 
      },
      req.body,
      { new: true }
    );
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }
    
    res.json(questionnaire);
  } catch (error) {
    console.error('Erreur lors de la modification du questionnaire:', error);
    res.status(500).json({ message: 'Erreur lors de la modification du questionnaire' });
  }
});

// NOUVELLE ROUTE : Toggle public/privé pour les questionnaires
router.patch('/:id/togglePublic', authMiddleware, async (req, res) => {
  console.log("Route /togglePublic appelée pour le questionnaire:", req.params.id);
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de questionnaire invalide' });
    }

    const questionnaire = await Questionnaire.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }
    
    // Inverser la visibilité
    questionnaire.public = !questionnaire.public;
    await questionnaire.save();
    
    console.log(`Questionnaire ${req.params.id} maintenant ${questionnaire.public ? 'public' : 'privé'}`);
    res.json(questionnaire);
  } catch (error) {
    console.error('Erreur lors du basculement de la visibilité:', error);
    res.status(500).json({ message: error.message });
  }
});

// Route pour supprimer un questionnaire
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de questionnaire invalide' });
    }

    const questionnaire = await Questionnaire.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.userId 
    });
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }
    
    res.json({ message: 'Questionnaire supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du questionnaire:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du questionnaire' });
  }
});

// Route pour sauvegarder des liens associés aux éléments d'un questionnaire
router.post('/:id/links', authMiddleware, async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de questionnaire invalide' });
    }

    const { elementId, content, linkIndex, title } = req.body;
    const questionnaire = await Questionnaire.findById(req.params.id);
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }

    if (!questionnaire.links) {
      questionnaire.links = new Map();
    }

    const key = `${elementId}_${linkIndex}`;
    questionnaire.links.set(key, { content, title });
    await questionnaire.save();

    res.json({ message: 'Lien sauvegardé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du lien:', error);
    res.status(500).json({ message: 'Erreur lors de la sauvegarde du lien' });
  }
});

// Route pour récupérer les liens d'un questionnaire
router.get('/:id/links', authMiddleware, async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de questionnaire invalide' });
    }

    const questionnaire = await Questionnaire.findById(req.params.id);
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }

    const links = questionnaire.links || new Map();
    const linksObject = Object.fromEntries(links);
    
    res.json({ links: linksObject });
  } catch (error) {
    console.error('Erreur lors de la récupération des liens:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des liens' });
  }
});

module.exports = router;