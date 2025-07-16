// routes/questionnaireRoutes.js - VERSION CORRIGÉE
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
    const modalities = req.query.modalities ? req.query.modalities.split(',').filter(Boolean) : [];
    const specialties = req.query.specialties ? req.query.specialties.split(',').filter(Boolean) : [];
    const locations = req.query.locations ? req.query.locations.split(',').filter(Boolean) : [];

    // Construction du filtre de recherche
    let searchFilter = {
      user: req.userId // Questionnaires de l'utilisateur connecté uniquement
    };

    // Recherche textuelle
    if (search.trim()) {
      searchFilter.title = { $regex: search, $options: 'i' };
    }

    // Filtres par tags/modalités
    if (modalities.length > 0 || specialties.length > 0 || locations.length > 0) {
      const allFilters = [...modalities, ...specialties, ...locations];
      searchFilter.tags = { $in: allFilters };
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

    res.json({
      questionnaires,
      currentPage: page,
      totalPages,
      total
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des questionnaires utilisateur:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des questionnaires',
      error: error.message 
    });
  }
});

// Route pour récupérer les questionnaires publics
router.get('/public', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const modalities = req.query.modalities ? req.query.modalities.split(',').filter(Boolean) : [];
    const specialties = req.query.specialties ? req.query.specialties.split(',').filter(Boolean) : [];
    const locations = req.query.locations ? req.query.locations.split(',').filter(Boolean) : [];

    let searchFilter = {
      public: true // Questionnaires publics uniquement
    };

    if (search.trim()) {
      searchFilter.title = { $regex: search, $options: 'i' };
    }

    if (modalities.length > 0 || specialties.length > 0 || locations.length > 0) {
      const allFilters = [...modalities, ...specialties, ...locations];
      searchFilter.tags = { $in: allFilters };
    }

    const total = await Questionnaire.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);

    const questionnaires = await Questionnaire.find(searchFilter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      questionnaires,
      currentPage: page,
      totalPages,
      total
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des questionnaires publics:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des questionnaires publics',
      error: error.message 
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