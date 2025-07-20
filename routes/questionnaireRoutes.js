// routes/questionnaireRoutes.js - VERSION CORRIGÉE FINALE
const express = require('express');
const router = express.Router();
const Questionnaire = require('../models/Questionnaire');
const QuestionnaireRating = require('../models/QuestionnaireRating');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// IMPORTANT: Les routes spécifiques DOIVENT être avant les routes avec paramètres

// ==================== FONCTIONS UTILITAIRES ====================

// 🔧 CORRECTION : Fonction pour normaliser hiddenQuestions
function normalizeHiddenQuestionsForSave(hiddenQuestions) {
  if (!hiddenQuestions) return {};
  if (typeof hiddenQuestions === 'string') {
    try {
      const parsed = JSON.parse(hiddenQuestions);
      return Array.isArray(parsed) ? {} : parsed;
    } catch {
      return {};
    }
  }
  if (Array.isArray(hiddenQuestions)) return {};
  if (typeof hiddenQuestions === 'object') return hiddenQuestions;
  return {};
}

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
      await existingRating.save();

      // Recalculer la moyenne
      const allRatings = await QuestionnaireRating.find({ questionnaire: questionnaireId });
      const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = Number((totalRating / allRatings.length).toFixed(1));

      // Mettre à jour le questionnaire
      questionnaire.averageRating = averageRating;
      await questionnaire.save();

      res.json({
        message: 'Note mise à jour avec succès',
        rating: existingRating,
        averageRating,
        ratingsCount: allRatings.length
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

      // Recalculer la moyenne et le nombre total
      const allRatings = await QuestionnaireRating.find({ questionnaire: questionnaireId });
      const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = Number((totalRating / allRatings.length).toFixed(1));

      // Mettre à jour le questionnaire
      questionnaire.averageRating = averageRating;
      questionnaire.ratingsCount = allRatings.length;
      await questionnaire.save();

      res.json({
        message: 'Note ajoutée avec succès',
        rating: newRating,
        averageRating,
        ratingsCount: allRatings.length
      });
    }
  } catch (error) {
    console.error('Erreur lors de la notation:', error);
    res.status(500).json({ message: 'Erreur lors de la notation du questionnaire' });
  }
});

// Récupérer la note d'un utilisateur pour un questionnaire
router.get('/:id/my-rating', authMiddleware, async (req, res) => {
  try {
    const questionnaireId = req.params.id;
    const userId = req.userId;

    const rating = await QuestionnaireRating.findOne({
      questionnaire: questionnaireId,
      user: userId
    });

    if (!rating) {
      return res.status(404).json({ message: 'Aucune note trouvée' });
    }

    res.json(rating);
  } catch (error) {
    console.error('Erreur lors de la récupération de la note:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la note' });
  }
});

// Récupérer toutes les notes d'un questionnaire (pour les propriétaires)
router.get('/:id/ratings', authMiddleware, async (req, res) => {
  try {
    const questionnaireId = req.params.id;

    // Vérifier que l'utilisateur est le propriétaire du questionnaire
    const questionnaire = await Questionnaire.findById(questionnaireId);
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }

    if (questionnaire.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé' });
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

// ==================== ROUTES PRINCIPALES ====================

// Créer un questionnaire - ✅ ROUTE CORRIGÉE
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Récupérer tous les champs depuis le corps de la requête
    const { 
      title, 
      questions, 
      selectedOptions, 
      crData, 
      hiddenQuestions,
      pageTitles,
      links,
      tags,
      public
    } = req.body;
    
    console.log(`✅ Création du questionnaire : ${title}`);
    console.log('✅ Données reçues:', {
      title,
      questionsCount: questions?.length || 0,
      selectedOptionsCount: Object.keys(selectedOptions || {}).length,
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

    // ✅ CORRECTION CRITIQUE : Créer le questionnaire avec les bons types de données
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
      hiddenQuestionsCount: newQuestionnaire.hiddenQuestions ? Object.keys(newQuestionnaire.hiddenQuestions).length : 0,
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

    // Incrémenter le nombre de vues seulement si ce n'est pas le propriétaire
    if (questionnaire.user.toString() !== req.userId) {
      await Questionnaire.findByIdAndUpdate(req.params.id, {
        $inc: { views: 1 }
      });
    }

    // Récupérer la note de l'utilisateur actuel s'il existe
    let userRating = null;
    if (questionnaire.public && questionnaire.user.toString() !== req.userId) {
      userRating = await QuestionnaireRating.findOne({
        questionnaire: req.params.id,
        user: req.userId
      });
    }

    // Ajouter la note de l'utilisateur au questionnaire retourné
    const questionnaireWithRating = {
      ...questionnaire.toObject(),
      userRating: userRating ? { rating: userRating.rating, comment: userRating.comment } : null
    };
    
    res.json(questionnaireWithRating);
  } catch (error) {
    console.error('Erreur lors de la récupération du questionnaire:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du questionnaire' });
  }
});

// Route pour modifier un questionnaire
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de questionnaire invalide' });
    }

    // 🔧 CORRECTION : Normaliser hiddenQuestions pour la mise à jour
    const updateData = { ...req.body };
    if (updateData.hiddenQuestions) {
      updateData.hiddenQuestions = normalizeHiddenQuestionsForSave(updateData.hiddenQuestions);
    }

    // ✅ CORRECTION : S'assurer que links est un objet, pas un Map
    if (updateData.links && typeof updateData.links === 'object') {
      // Si c'est un Map, le convertir en objet
      if (updateData.links instanceof Map) {
        updateData.links = Object.fromEntries(updateData.links);
      }
    }

    const questionnaire = await Questionnaire.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updateData,
      { new: true, runValidators: true }
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

// Route pour récupérer les questionnaires de l'utilisateur connecté (privés et publics)
router.get('/my/questionnaires', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'updatedAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Critères de recherche
    const searchCriteria = {
      user: req.userId
    };
    
    if (search) {
      searchCriteria.title = { $regex: search, $options: 'i' };
    }
    
    const questionnaires = await Questionnaire.find(searchCriteria)
      .select('title description public averageRating ratingsCount views copies createdAt updatedAt tags')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);
    
    const total = await Questionnaire.countDocuments(searchCriteria);
    const totalPages = Math.ceil(total / limit);
    
    // Normalisation des questionnaires pour éviter les erreurs frontend
    const safeQuestionnaires = questionnaires.map(q => ({
      _id: q._id,
      title: q.title || '',
      description: q.description || '',
      public: Boolean(q.public),
      averageRating: Number(q.averageRating) || 0,
      ratingsCount: Number(q.ratingsCount) || 0,
      views: Number(q.views) || 0,
      copies: Number(q.copies) || 0,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      tags: Array.isArray(q.tags) ? q.tags : []
    }));

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

// Route pour récupérer les questionnaires publics avec pagination et recherche
router.get('/public/questionnaires', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'averageRating';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Critères de recherche pour les questionnaires publics seulement
    const searchCriteria = {
      public: true,
      user: { $ne: req.userId } // Exclure les questionnaires de l'utilisateur actuel
    };
    
    if (search) {
      searchCriteria.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const questionnaires = await Questionnaire.find(searchCriteria)
      .populate('user', 'username')
      .select('title description public averageRating ratingsCount views copies createdAt updatedAt user tags')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);
    
    const total = await Questionnaire.countDocuments(searchCriteria);
    const totalPages = Math.ceil(total / limit);
    
    // Normalisation des questionnaires pour éviter les erreurs frontend
    const normalizedQuestionnaires = questionnaires.map(q => ({
      _id: q._id,
      title: q.title || '',
      description: q.description || '',
      public: Boolean(q.public),
      averageRating: Number(q.averageRating) || 0,
      ratingsCount: Number(q.ratingsCount) || 0,
      views: Number(q.views) || 0,
      copies: Number(q.copies) || 0,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      user: q.user ? {
        _id: q.user._id,
        username: q.user.username || 'Utilisateur anonyme'
      } : null,
      tags: Array.isArray(q.tags) ? q.tags : []
    }));

    // Vérification finale pour éviter les erreurs
    const safeQuestionnaires = normalizedQuestionnaires?.length ? normalizedQuestionnaires : [];

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

    // ✅ CORRECTION : Créer une copie du questionnaire avec les bons types
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
    questionnaire.tags = questionnaire.tags ? 
      questionnaire.tags.filter(t => t !== tagToRemove) : [];
    await questionnaire.save();

    res.json({ tags: questionnaire.tags });
  } catch (error) {
    console.error('Erreur lors de la suppression du tag:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du tag' });
  }
});

// ==================== ROUTES POUR LES LIENS ====================

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

    // ✅ CORRECTION : Travailler avec un objet au lieu d'un Map
    const links = questionnaire.links ? (questionnaire.links[req.params.elementId] || []) : [];
    res.json({ links });
  } catch (error) {
    console.error('Erreur lors de la récupération des liens:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des liens' });
  }
});

// Route pour supprimer un lien
router.delete('/:id/links/:elementId/:linkIndex', authMiddleware, async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de questionnaire invalide' });
    }

    const questionnaire = await Questionnaire.findById(req.params.id);
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }

    const { elementId, linkIndex } = req.params;
    
    // ✅ CORRECTION : Travailler avec un objet au lieu d'un Map
    if (questionnaire.links && questionnaire.links[elementId]) {
      questionnaire.links[elementId].splice(parseInt(linkIndex), 1);
      
      // Si plus de liens, supprimer la clé
      if (questionnaire.links[elementId].length === 0) {
        delete questionnaire.links[elementId];
      }
      
      questionnaire.markModified('links');
      await questionnaire.save();
    }

    res.json({ message: 'Lien supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du lien:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du lien' });
  }
});

module.exports = router;