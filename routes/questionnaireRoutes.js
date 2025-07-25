// routes/questionnaireRoutes.js - VERSION FINALE AVEC ROUTE /togglePublic AJOUTÉE
const express = require('express');
const router = express.Router();
const Questionnaire = require('../models/Questionnaire');
const QuestionnaireRating = require('../models/QuestionnaireRating');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// IMPORTANT: Les routes spécifiques DOIVENT être avant les routes avec paramètres

// ==================== ROUTES DE NOTATION POUR LES QUESTIONNAIRES ====================

// Noter un questionnaire public
router.post('/:id/rate', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const questionnaireId = req.params.id;
    const userId = req.userId;

    // Validation des données
    if (rating === undefined || rating === null || rating < 0 || rating > 10) {
      return res.status(400).json({ 
        message: 'La note doit être comprise entre 0 et 10' 
      });
    }

    // Vérifier que le questionnaire existe et est public
    const questionnaire = await Questionnaire.findById(questionnaireId);
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }

    if (!questionnaire.public) {
      return res.status(403).json({ message: 'Seuls les questionnaires publics peuvent être notés' });
    }

    // Empêcher l'auto-notation
    if (questionnaire.user.toString() === userId) {
      return res.status(403).json({ message: 'Vous ne pouvez pas noter votre propre questionnaire' });
    }

    // Vérifier si l'utilisateur a déjà noté ce questionnaire
    let existingRating = await QuestionnaireRating.findOne({
      questionnaire: questionnaireId,
      user: userId
    });

    if (existingRating) {
      // Mettre à jour la note existante
      const oldRating = existingRating.rating;
      existingRating.rating = rating;
      existingRating.comment = comment || '';
      existingRating.updatedAt = new Date();
      await existingRating.save();

      // Mettre à jour la note moyenne du questionnaire
      await questionnaire.updateRating(oldRating, rating);

      res.json({
        message: 'Note mise à jour avec succès',
        rating: existingRating,
        averageRating: questionnaire.averageRating,
        ratingsCount: questionnaire.ratingsCount
      });
    } else {
      // Créer une nouvelle note
      const newRating = new QuestionnaireRating({
        questionnaire: questionnaireId,
        user: userId,
        rating,
        comment: comment || ''
      });
      await newRating.save();

      // Mettre à jour la note moyenne du questionnaire
      await questionnaire.addRating(rating);

      res.status(201).json({
        message: 'Note ajoutée avec succès',
        rating: newRating,
        averageRating: questionnaire.averageRating,
        ratingsCount: questionnaire.ratingsCount
      });
    }
  } catch (error) {
    console.error('Erreur lors de la notation:', error);
    res.status(500).json({ message: 'Erreur lors de la notation du questionnaire' });
  }
});

// Récupérer toutes les notes d'un questionnaire public
router.get('/:id/ratings', async (req, res) => {
  try {
    const questionnaireId = req.params.id;

    // Vérifier que le questionnaire existe et est public
    const questionnaire = await Questionnaire.findById(questionnaireId);
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }

    if (!questionnaire.public) {
      return res.status(403).json({ message: 'Seuls les questionnaires publics peuvent être consultés' });
    }

    const ratings = await QuestionnaireRating.find({ questionnaire: questionnaireId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des notes' });
  }
});

// 🔧 FONCTION UTILITAIRE : Normaliser hiddenQuestions pour l'affichage
function normalizeHiddenQuestionsForDisplay(hiddenQuestions) {
  if (!hiddenQuestions) return {};
  
  if (Array.isArray(hiddenQuestions)) {
    // Convertir tableau vers objet
    const hiddenQuestionsObj = {};
    hiddenQuestions.forEach(questionId => {
      hiddenQuestionsObj[questionId] = true;
    });
    return hiddenQuestionsObj;
  }
  
  if (typeof hiddenQuestions === 'object') {
    // C'est déjà un objet, on le retourne tel quel
    return hiddenQuestions;
  }
  
  return {};
}

// 🔧 FONCTION UTILITAIRE : Normaliser hiddenQuestions pour la sauvegarde
function normalizeHiddenQuestionsForSave(hiddenQuestions) {
  if (!hiddenQuestions) return [];
  
  if (Array.isArray(hiddenQuestions)) {
    // C'est déjà un tableau, on le filtre pour garder que les strings
    return hiddenQuestions.filter(item => typeof item === 'string');
  }
  
  if (typeof hiddenQuestions === 'object') {
    // Convertir objet vers tableau
    return Object.keys(hiddenQuestions).filter(key => hiddenQuestions[key]);
  }
  
  return [];
}

// 🚨 ROUTE MANQUANTE AJOUTÉE : /my pour récupérer les questionnaires de l'utilisateur connecté
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const modality = req.query.modality || '';
    const specialty = req.query.specialty || '';
    const location = req.query.location || '';

    console.log('🚨 Route /my appelée avec les paramètres:', {
      page,
      limit,
      search,
      modality,
      specialty,
      location,
      userId: req.userId
    });

    // Construction du filtre de recherche
    let searchFilter = {
      user: req.userId // SEULEMENT les questionnaires de l'utilisateur connecté
    };

    // Recherche textuelle
    if (search.trim()) {
      searchFilter.title = { $regex: search, $options: 'i' };
    }

    // Filtres par tags (si fournis)
    const tagFilters = [];
    if (modality) tagFilters.push(...modality.split(',').filter(Boolean));
    if (specialty) tagFilters.push(...specialty.split(',').filter(Boolean));
    if (location) tagFilters.push(...location.split(',').filter(Boolean));
    
    if (tagFilters.length > 0) {
      searchFilter.tags = { $in: tagFilters };
    }

    console.log('✅ Filtre de recherche questionnaires /my:', searchFilter);

    // Compter le total
    const total = await Questionnaire.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);

    console.log(`📊 Total questionnaires trouvés pour l'utilisateur: ${total}`);

    // Récupérer les questionnaires avec pagination
    const questionnaires = await Questionnaire.find(searchFilter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    console.log(`📝 ${questionnaires.length} questionnaires récupérés de la base`);

    // 🔧 CORRECTION : Normaliser hiddenQuestions pour tous les questionnaires
    const normalizedQuestionnaires = questionnaires.map(questionnaire => ({
      ...questionnaire,
      hiddenQuestions: normalizeHiddenQuestionsForDisplay(questionnaire.hiddenQuestions)
    }));

    // S'assurer que questionnaires est toujours un tableau
    const safeQuestionnaires = Array.isArray(normalizedQuestionnaires) ? normalizedQuestionnaires : [];

    console.log(`✅ Réponse finale: ${safeQuestionnaires.length} questionnaires normalisés`);

    res.json({
      questionnaires: safeQuestionnaires,
      currentPage: page,
      totalPages: totalPages,
      totalQuestionnaires: total
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des questionnaires /my:', error);
    res.json({
      questionnaires: [], // Toujours retourner un tableau vide en cas d'erreur
      currentPage: 1,
      totalPages: 0,
      totalQuestionnaires: 0
    });
  }
});

// Route pour récupérer tous les questionnaires publics (garde la structure existante)
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
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }

    // Filtres par tags
    const tagFilters = [];
    if (modality) tagFilters.push(...modality.split(',').filter(Boolean));
    if (specialty) tagFilters.push(...specialty.split(',').filter(Boolean));
    if (location) tagFilters.push(...location.split(',').filter(Boolean));
    
    if (tagFilters.length > 0) {
      filter.tags = { $in: tagFilters };
    }

    // Récupérer les questionnaires publics avec pagination
    const questionnaires = await Questionnaire.find(filter)
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalQuestionnaires = await Questionnaire.countDocuments(filter);
    const totalPages = Math.ceil(totalQuestionnaires / limit);

    // Normaliser hiddenQuestions pour tous les questionnaires
    const normalizedQuestionnaires = questionnaires.map(questionnaire => ({
      ...questionnaire,
      hiddenQuestions: normalizeHiddenQuestionsForDisplay(questionnaire.hiddenQuestions),
      averageRating: questionnaire.averageRating || 0,
      ratingsCount: questionnaire.ratingsCount || 0,
      views: questionnaire.views || 0,
      copies: questionnaire.copies || 0
    }));

    res.json({
      questionnaires: normalizedQuestionnaires,
      currentPage: page,
      totalPages,
      totalQuestionnaires
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

// Route générale pour récupérer tous les questionnaires (garder pour compatibilité)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const tags = req.query.tags || '';
    const sortBy = req.query.sortBy || 'updatedAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const showPublic = req.query.showPublic === 'true';

    // Construction du filtre de recherche
    let searchFilter = {};

    if (showPublic) {
      searchFilter.public = true;
    } else {
      searchFilter.user = req.userId;
    }

    // Recherche textuelle
    if (search.trim()) {
      searchFilter.$or = [
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtre par tags
    if (tags.trim()) {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (tagArray.length > 0) {
        searchFilter.tags = { $in: tagArray };
      }
    }

    console.log('✅ Filtre de recherche questionnaires généraux:', searchFilter);

    // Compter le total
    const total = await Questionnaire.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);

    // Récupérer les questionnaires avec pagination
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    const questionnaires = await Questionnaire.find(searchFilter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'username')
      .lean();

    // 🔧 CORRECTION : Normaliser hiddenQuestions pour tous les questionnaires
    const normalizedQuestionnaires = questionnaires.map(questionnaire => ({
      ...questionnaire,
      hiddenQuestions: normalizeHiddenQuestionsForDisplay(questionnaire.hiddenQuestions)
    }));

    // S'assurer que questionnaires est toujours un tableau
    const safeQuestionnaires = Array.isArray(normalizedQuestionnaires) ? normalizedQuestionnaires : [];

    res.json({
      questionnaires: safeQuestionnaires,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des questionnaires:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des questionnaires' });
  }
});

// Route pour créer un nouveau questionnaire
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, questions, selectedOptions, crData, hiddenQuestions, pageTitles, links, tags, public } = req.body;

    console.log('✅ Données reçues pour création:', {
      title,
      questionsCount: questions?.length || 0,
      selectedOptions: selectedOptions ? 'présent' : 'absent',
      crData: crData ? 'présent' : 'absent',
      hiddenQuestionsType: typeof hiddenQuestions,
      hiddenQuestionsContent: hiddenQuestions,
      pageTitlesCount: Object.keys(pageTitles || {}).length,
      linksCount: links ? Object.keys(links).length : 0,
      tagsCount: tags?.length || 0,
      public: public || false
    });

    // 🔧 CORRECTION : Normaliser hiddenQuestions pour la sauvegarde
    const hiddenQuestionsArray = normalizeHiddenQuestionsForSave(hiddenQuestions);

    console.log('🔧 Normalisation hiddenQuestions:', {
      original: hiddenQuestions,
      converted: hiddenQuestionsArray,
      type: typeof hiddenQuestionsArray,
      isArray: Array.isArray(hiddenQuestionsArray)
    });

    // ✅ CORRECTION CRITIQUE : Créer le questionnaire SANS new Map()
    const questionnaire = new Questionnaire({
      title,
      questions: questions || [],
      selectedOptions: selectedOptions || {},
      crData: crData || { crTexts: {}, freeTexts: {} },
      hiddenQuestions: hiddenQuestionsArray,
      pageTitles: pageTitles || {},
      links: links || {}, // ← CORRECTION : {} au lieu de new Map()
      tags: tags || [],
      public: public || false,
      user: req.userId,
      // Champs de notation
      averageRating: 0,
      ratingsCount: 0,
      views: 0,
      copies: 0
    });

    const newQuestionnaire = await questionnaire.save();
    
    console.log('✅ Questionnaire créé avec succès:', {
      id: newQuestionnaire._id,
      title: newQuestionnaire.title,
      questionsCount: newQuestionnaire.questions?.length || 0,
      hiddenQuestionsCount: newQuestionnaire.hiddenQuestions?.length || 0,
      linksType: typeof newQuestionnaire.links
    });
    
    res.status(201).json(newQuestionnaire);
  } catch (error) {
    console.error('❌ Erreur lors de la création du questionnaire:', error);
    res.status(500).json({ message: 'Erreur lors de la création du questionnaire' });
  }
});

// Route pour récupérer un questionnaire par ID avec gestion des vues et notes utilisateur
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

    // 🔧 CORRECTION : Normaliser hiddenQuestions pour l'affichage
    questionnaireObject.hiddenQuestions = normalizeHiddenQuestionsForDisplay(questionnaire.hiddenQuestions);

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
    console.error('❌ Erreur lors de la récupération du questionnaire:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du questionnaire' });
  }
});

// ✅ NOUVELLE ROUTE AJOUTÉE : Route pour basculer la visibilité public/privé d'un questionnaire
router.patch('/:id/togglePublic', authMiddleware, async (req, res) => {
  try {
    console.log('🔄 Toggle public appelé pour questionnaire:', req.params.id);
    
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de questionnaire invalide' });
    }

    // Récupérer le questionnaire
    const questionnaire = await Questionnaire.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }

    // Basculer la visibilité
    questionnaire.public = !questionnaire.public;
    await questionnaire.save();

    console.log('✅ Visibilité du questionnaire mise à jour:', {
      id: questionnaire._id,
      title: questionnaire.title,
      public: questionnaire.public
    });

    res.json({
      message: 'Visibilité mise à jour avec succès',
      public: questionnaire.public,
      questionnaire
    });

  } catch (error) {
    console.error('❌ Erreur lors du basculement de visibilité:', error);
    res.status(500).json({ message: 'Erreur lors du changement de visibilité' });
  }
});

// Route pour mettre à jour un questionnaire
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de questionnaire invalide' });
    }

    console.log('✅ Mise à jour du questionnaire:', req.params.id);

    // 🔧 CORRECTION : Normaliser updateData ET corriger links
    const updateData = { ...req.body };
    
    if (updateData.hiddenQuestions !== undefined) {
      updateData.hiddenQuestions = normalizeHiddenQuestionsForSave(updateData.hiddenQuestions);
    }

    // ✅ CORRECTION : S'assurer que links est un objet, pas un Map
    if (updateData.links && typeof updateData.links === 'object') {
      // Si c'est un Map, le convertir en objet
      if (updateData.links instanceof Map) {
        updateData.links = Object.fromEntries(updateData.links);
      }
    }

    console.log('✅ Données reçues pour mise à jour:', {
      title: updateData.title,
      questionsCount: updateData.questions?.length || 0,
      selectedOptionsCount: Object.keys(updateData.selectedOptions || {}).length,
      crData: updateData.crData ? 'présent' : 'absent',
      hiddenQuestionsType: typeof updateData.hiddenQuestions,
      hiddenQuestionsCount: updateData.hiddenQuestions?.length || 0,
      linksType: typeof updateData.links
    });

    const questionnaire = await Questionnaire.findOneAndUpdate(
      { 
        _id: req.params.id, 
        user: req.userId 
      },
      updateData,
      { new: true }
    );
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }
    
    console.log('✅ Questionnaire mis à jour avec succès');
    
    // 🔧 CORRECTION : Normaliser hiddenQuestions pour le retour
    const questionnaireObject = questionnaire.toObject();
    questionnaireObject.hiddenQuestions = normalizeHiddenQuestionsForDisplay(questionnaire.hiddenQuestions);
    
    res.json(questionnaireObject);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du questionnaire:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du questionnaire' });
  }
});

// Route pour modifier la visibilité (public/privé) - Route générale PATCH
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

// ✅ CORRECTION : Route pour sauvegarder des liens - SANS Map()
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

    // ✅ CORRECTION : Travailler avec un objet au lieu d'un Map
    if (!questionnaire.links) {
      questionnaire.links = {};
    }

    let existingLinks = questionnaire.links[elementId] || [];
    
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

    questionnaire.links[elementId] = existingLinks;
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

// ✅ CORRECTION : Route pour récupérer les liens - SANS Map()
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

    // ✅ CORRECTION : Travailler avec un objet au lieu d'un Map
    const links = questionnaire.links ? questionnaire.links[req.params.elementId] || [] : [];
    
    res.json(links);
  } catch (error) {
    console.error('Erreur lors de la récupération des liens:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des liens' });
  }
});

// Copier un questionnaire public
router.post('/:id/copy', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de questionnaire invalide' });
    }

    const originalQuestionnaire = await Questionnaire.findById(req.params.id);
    
    if (!originalQuestionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }

    if (!originalQuestionnaire.public) {
      return res.status(403).json({ message: 'Seuls les questionnaires publics peuvent être copiés' });
    }

    // 🔧 CORRECTION : Normaliser hiddenQuestions pour la copie
    const hiddenQuestionsArray = normalizeHiddenQuestionsForSave(originalQuestionnaire.hiddenQuestions);

    // ✅ CORRECTION CRITIQUE : Créer une copie du questionnaire SANS new Map()
    const newQuestionnaire = new Questionnaire({
      title: `Copie de ${originalQuestionnaire.title}`,
      questions: originalQuestionnaire.questions,
      selectedOptions: {},
      crData: { crTexts: {}, freeTexts: {} },
      hiddenQuestions: hiddenQuestionsArray,
      pageTitles: originalQuestionnaire.pageTitles || {},
      links: {}, // ← CORRECTION : {} au lieu de new Map()
      tags: originalQuestionnaire.tags || [],
      public: false,
      user: req.userId,
      averageRating: 0,
      ratingsCount: 0,
      views: 0,
      copies: 0
    });

    const savedQuestionnaire = await newQuestionnaire.save();

    // Incrémenter le compteur de copies du questionnaire original
    await Questionnaire.findByIdAndUpdate(req.params.id, {
      $inc: { copies: 1 }
    });

    res.status(201).json({
      message: 'Questionnaire copié avec succès',
      id: savedQuestionnaire._id,
      questionnaire: savedQuestionnaire
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
    
    if (!tag || !tag.trim()) {
      return res.status(400).json({ message: 'Le tag ne peut pas être vide' });
    }
    
    const questionnaire = await Questionnaire.findById(req.params.id);
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }
    
    if (questionnaire.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    if (!questionnaire.tags.includes(tag.trim())) {
      questionnaire.tags.push(tag.trim());
      await questionnaire.save();
    }
    
    res.json(questionnaire);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du tag:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du tag' });
  }
});

// Supprimer un tag d'un questionnaire
router.delete('/:id/tags/:tag', authMiddleware, async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findById(req.params.id);
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }
    
    if (questionnaire.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    questionnaire.tags = questionnaire.tags.filter(tag => tag !== req.params.tag);
    await questionnaire.save();
    
    res.json(questionnaire);
  } catch (error) {
    console.error('Erreur lors de la suppression du tag:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du tag' });
  }
});

module.exports = router;