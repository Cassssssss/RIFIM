// routes/questionnaireRoutes.js - VERSION CORRIGÉE COMPLÈTE
const express = require('express');
const router = express.Router();
const Questionnaire = require('../models/Questionnaire');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// IMPORTANT: Les routes spécifiques DOIVENT être avant les routes avec paramètres

// Route pour récupérer les questionnaires de l'utilisateur connecté
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const modality = req.query.modality || '';
    const specialty = req.query.specialty || '';
    const location = req.query.location || '';

    // Construction du filtre de recherche
    let searchFilter = {
      user: req.userId // Questionnaires de l'utilisateur connecté uniquement
    };

    // Recherche textuelle
    if (search.trim()) {
      searchFilter.title = { $regex: search, $options: 'i' };
    }

    // Filtres par tags
    const filters = [];
    if (modality) filters.push(...modality.split(',').filter(Boolean));
    if (specialty) filters.push(...specialty.split(',').filter(Boolean));
    if (location) filters.push(...location.split(',').filter(Boolean));
    
    if (filters.length > 0) {
      searchFilter.tags = { $in: filters };
    }

    console.log('Filtre de recherche:', searchFilter);

    // Compter le total
    const total = await Questionnaire.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);

    // Récupérer les questionnaires avec pagination
    const questionnaires = await Questionnaire.find(searchFilter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // S'assurer que questionnaires est toujours un tableau
    const safeQuestionnaires = Array.isArray(questionnaires) ? questionnaires : [];

    res.json({
      questionnaires: safeQuestionnaires,
      currentPage: page,
      totalPages,
      total,
      totalQuestionnaires: total // Ajout pour compatibilité
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des questionnaires utilisateur:', error);
    // En cas d'erreur, renvoyer une structure avec un tableau vide
    res.json({
      questionnaires: [], // Toujours un tableau
      currentPage: 1,
      totalPages: 0,
      total: 0,
      totalQuestionnaires: 0
    });
  }
});

// Route pour récupérer les questionnaires publics
router.get('/public', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const modality = req.query.modality || '';
    const specialty = req.query.specialty || '';
    const location = req.query.location || '';

    let searchFilter = {
      public: true // Questionnaires publics uniquement
    };

    if (search.trim()) {
      searchFilter.title = { $regex: search, $options: 'i' };
    }

    // Filtres par tags
    const filters = [];
    if (modality) filters.push(...modality.split(',').filter(Boolean));
    if (specialty) filters.push(...specialty.split(',').filter(Boolean));
    if (location) filters.push(...location.split(',').filter(Boolean));
    
    if (filters.length > 0) {
      searchFilter.tags = { $in: filters };
    }

    const total = await Questionnaire.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);

    const questionnaires = await Questionnaire.find(searchFilter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // S'assurer que questionnaires est toujours un tableau
    const safeQuestionnaires = Array.isArray(questionnaires) ? questionnaires : [];

    res.json({
      questionnaires: safeQuestionnaires,
      currentPage: page,
      totalPages,
      total,
      totalQuestionnaires: total
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des questionnaires publics:', error);
    res.json({
      questionnaires: [], // Toujours un tableau
      currentPage: 1,
      totalPages: 0,
      total: 0,
      totalQuestionnaires: 0
    });
  }
});

// Route principale pour récupérer les questionnaires
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const modality = req.query.modality || '';
    const specialty = req.query.specialty || '';
    const location = req.query.location || '';

    // Construction du filtre de recherche
    let searchFilter = {
      user: req.userId // Questionnaires de l'utilisateur connecté uniquement
    };

    // Recherche textuelle
    if (search.trim()) {
      searchFilter.title = { $regex: search, $options: 'i' };
    }

    // Filtres par tags
    const filters = [];
    if (modality) filters.push(...modality.split(',').filter(Boolean));
    if (specialty) filters.push(...specialty.split(',').filter(Boolean));
    if (location) filters.push(...location.split(',').filter(Boolean));
    
    if (filters.length > 0) {
      searchFilter.tags = { $in: filters };
    }

    // Compter le total
    const total = await Questionnaire.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);

    // Récupérer les questionnaires avec pagination
    const questionnaires = await Questionnaire.find(searchFilter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // S'assurer que questionnaires est toujours un tableau
    const safeQuestionnaires = Array.isArray(questionnaires) ? questionnaires : [];

    res.json({
      questionnaires: safeQuestionnaires,
      currentPage: page,
      totalPages,
      total,
      totalQuestionnaires: total
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des questionnaires:', error);
    // En cas d'erreur, renvoyer une structure avec un tableau vide
    res.json({
      questionnaires: [], // Toujours un tableau
      currentPage: 1,
      totalPages: 0,
      total: 0,
      totalQuestionnaires: 0
    });
  }
});

// Route pour ajouter un tag
router.post('/:id/tags', authMiddleware, async (req, res) => {
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

    const { tag } = req.body;
    if (!tag || !tag.trim()) {
      return res.status(400).json({ message: 'Tag requis' });
    }

    // Initialiser tags si nécessaire
    if (!questionnaire.tags) {
      questionnaire.tags = [];
    }

    // Ajouter le tag s'il n'existe pas déjà
    const trimmedTag = tag.trim();
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

// Route pour supprimer un tag
router.delete('/:id/tags/:tag', authMiddleware, async (req, res) => {
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

    // Retirer le tag
    const tagToRemove = decodeURIComponent(req.params.tag);
    questionnaire.tags = questionnaire.tags ? questionnaire.tags.filter(t => t !== tagToRemove) : [];
    await questionnaire.save();

    res.json({ tags: questionnaire.tags });
  } catch (error) {
    console.error('Erreur lors de la suppression du tag:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du tag' });
  }
});

// Route pour créer un questionnaire
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
      tags: [] // Initialiser avec un tableau vide
    });

    const newQuestionnaire = await questionnaire.save();
    res.status(201).json(newQuestionnaire);
  } catch (error) {
    console.error('Erreur lors de la création du questionnaire:', error);
    res.status(500).json({ message: 'Erreur lors de la création du questionnaire' });
  }
});

// Route pour récupérer un questionnaire par ID
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
    
    res.json(questionnaire);
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

// Route pour changer la visibilité public/privé
router.patch('/:id/togglePublic', authMiddleware, async (req, res) => {
  try {
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

    questionnaire.public = !questionnaire.public;
    await questionnaire.save();
    
    res.json(questionnaire);
  } catch (error) {
    console.error('Erreur lors du changement de visibilité:', error);
    res.status(500).json({ message: 'Erreur lors du changement de visibilité' });
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

// Route pour copier un questionnaire
router.post('/:id/copy', authMiddleware, async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de questionnaire invalide' });
    }

    const originalQuestionnaire = await Questionnaire.findOne({
      _id: req.params.id,
      $or: [
        { user: req.userId },
        { public: true }
      ]
    });

    if (!originalQuestionnaire) {
      return res.status(404).json({
        message: 'Questionnaire non trouvé ou accès non autorisé'
      });
    }

    const newQuestionnaire = new Questionnaire({
      ...originalQuestionnaire.toObject(),
      _id: undefined,
      title: `${originalQuestionnaire.title} (copie)`,
      public: false,
      user: req.userId,
      links: new Map(originalQuestionnaire.links),
      tags: originalQuestionnaire.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newQuestionnaire.save();

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

// Route pour sauvegarder un lien
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

    let existingLinks = questionnaire.links.get(elementId) || [];
    
    if (typeof linkIndex !== 'undefined') {
      existingLinks[linkIndex] = {
        content,
        title,
        date: new Date()
      };
    } else {
      existingLinks.push({
        content,
        title,
        date: new Date()
      });
    }

    questionnaire.links.set(elementId, existingLinks);
    questionnaire.markModified('links');
    await questionnaire.save();

    res.json({
      message: 'Lien sauvegardé avec succès',
      links: existingLinks
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du lien:', error);
    res.status(500).json({ message: 'Erreur lors de la sauvegarde du lien' });
  }
});

// Route pour récupérer les liens
router.get('/:id/links/:elementId', authMiddleware, async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de questionnaire invalide' });
    }

    const questionnaire = await Questionnaire.findById(req.params.id);
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }

    const links = questionnaire.links.get(req.params.elementId) || [];
    res.json({ links });
  } catch (error) {
    console.error('Erreur lors de la récupération des liens:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des liens' });
  }
});

module.exports = router;