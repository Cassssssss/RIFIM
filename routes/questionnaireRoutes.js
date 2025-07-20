// routes/questionnaireRoutes.js - VERSION COMPATIBLE AVEC LES DONNÉES EXISTANTES
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

      // Recalculer la moyenne
      const allRatings = await QuestionnaireRating.find({ questionnaire: questionnaireId });
      const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRating / allRatings.length;

      await Questionnaire.findByIdAndUpdate(questionnaireId, {
        averageRating: Number(averageRating.toFixed(1))
      });

      res.json({ 
        message: 'Note mise à jour avec succès',
        rating: existingRating
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

      // Mettre à jour les statistiques du questionnaire
      const allRatings = await QuestionnaireRating.find({ questionnaire: questionnaireId });
      const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRating / allRatings.length;

      await Questionnaire.findByIdAndUpdate(questionnaireId, {
        averageRating: Number(averageRating.toFixed(1)),
        ratingsCount: allRatings.length
      });

      res.json({ 
        message: 'Note ajoutée avec succès',
        rating: newRating
      });
    }
  } catch (error) {
    console.error('Erreur lors de la notation:', error);
    res.status(500).json({ message: 'Erreur lors de la notation du questionnaire' });
  }
});

// Récupérer les notes d'un questionnaire
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

// Route pour récupérer tous les questionnaires (avec système de notation et tags)
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

    console.log('✅ Filtre de recherche questionnaires:', searchFilter);

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

    console.log(`✅ ${questionnaires.length} questionnaires trouvés`);

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

    // Créer une copie du questionnaire
    const newQuestionnaire = new Questionnaire({
      title: `Copie de ${originalQuestionnaire.title}`,
      questions: originalQuestionnaire.questions,
      selectedOptions: {},
      crData: { crTexts: {}, freeTexts: {} },
      hiddenQuestions: hiddenQuestionsArray,
      pageTitles: originalQuestionnaire.pageTitles || {},
      links: new Map(),
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

// 🔧 CORRECTION : Route pour créer un questionnaire compatible
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

    // Créer le questionnaire avec le type de données correct
    const questionnaire = new Questionnaire({
      title,
      questions: questions || [],
      selectedOptions: selectedOptions || {},
      crData: crData || { crTexts: {}, freeTexts: {} },
      hiddenQuestions: hiddenQuestionsArray,
      pageTitles: pageTitles || {},
      links: links || new Map(),
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
      hiddenQuestionsCount: newQuestionnaire.hiddenQuestions?.length || 0
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

// Route pour mettre à jour un questionnaire
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de questionnaire invalide' });
    }

    console.log('✅ Mise à jour du questionnaire:', req.params.id);

    // 🔧 CORRECTION : Normaliser updateData
    const updateData = { ...req.body };
    
    if (updateData.hiddenQuestions !== undefined) {
      updateData.hiddenQuestions = normalizeHiddenQuestionsForSave(updateData.hiddenQuestions);
    }

    console.log('✅ Données reçues pour mise à jour:', {
      title: updateData.title,
      questionsCount: updateData.questions?.length || 0,
      selectedOptionsCount: Object.keys(updateData.selectedOptions || {}).length,
      crData: updateData.crData ? 'présent' : 'absent',
      hiddenQuestionsType: typeof updateData.hiddenQuestions,
      hiddenQuestionsCount: updateData.hiddenQuestions?.length || 0
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