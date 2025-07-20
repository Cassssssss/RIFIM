// routes/questionnaireRoutes.js - VERSION COMPLÈTE AVEC SYSTÈME DE NOTATION - PROBLÈME DE SAUVEGARDE CORRIGÉ
const express = require('express');
const router = express.Router();
const Questionnaire = require('../models/Questionnaire');
const QuestionnaireRating = require('../models/QuestionnaireRating'); // NOUVEAU : Import du modèle de notation
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// IMPORTANT: Les routes spécifiques DOIVENT être avant les routes avec paramètres

// ==================== ROUTES DE NOTATION POUR LES QUESTIONNAIRES ====================

// Noter un questionnaire public
router.post('/:id/rate', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const questionnaireId = req.params.id;
    const userId = req.userId; // ✅ CORRIGÉ : utiliser req.userId au lieu de req.user._id

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
    if (questionnaire.user.toString() === userId) { // ✅ CORRIGÉ : supprimé .toString() sur userId
      return res.status(403).json({ message: 'Vous ne pouvez pas noter votre propre questionnaire' });
    }

    // Vérifier si l'utilisateur a déjà noté ce questionnaire
    let existingRating = await QuestionnaireRating.findOne({ 
      questionnaire: questionnaireId, 
      user: userId 
    });

    if (existingRating) {
      // Mettre à jour la note existante
      existingRating.rating = rating;
      existingRating.comment = comment || '';
      existingRating.updatedAt = new Date();
      await existingRating.save();
    } else {
      // Créer une nouvelle note
      existingRating = new QuestionnaireRating({
        questionnaire: questionnaireId,
        user: userId,
        rating: rating,
        comment: comment || '',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await existingRating.save();
    }

    // Recalculer la note moyenne et le nombre de notes
    const allRatings = await QuestionnaireRating.find({ questionnaire: questionnaireId });
    const averageRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    // Mettre à jour le questionnaire avec les nouvelles notes
    await Questionnaire.findByIdAndUpdate(questionnaireId, {
      averageRating: Math.round(averageRating * 10) / 10, // Arrondir à 1 décimale
      ratingsCount: allRatings.length
    });

    res.json({
      message: 'Note ajoutée avec succès',
      userRating: existingRating.rating,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingsCount: allRatings.length
    });

  } catch (error) {
    console.error('Erreur lors de la notation du questionnaire:', error);
    res.status(500).json({ message: 'Erreur lors de la notation du questionnaire' });
  }
});

// ==================== ROUTES PRINCIPALES ====================

// Route pour récupérer tous les questionnaires de l'utilisateur connecté
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    // Construction du filtre de recherche
    let searchFilter = {
      user: req.userId // Questionnaires de l'utilisateur connecté uniquement
    };

    // Recherche textuelle si fournie
    if (search.trim()) {
      searchFilter.title = { $regex: search, $options: 'i' };
    }

    console.log('Filtre de recherche questionnaires:', searchFilter);

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
      totalPages: totalPages,
      totalQuestionnaires: total
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des questionnaires:', error);
    res.json({
      questionnaires: [], // Toujours retourner un tableau vide en cas d'erreur
      currentPage: 1,
      totalPages: 0,
      totalQuestionnaires: 0
    });
  }
});

// Route pour récupérer tous les questionnaires publics avec filtres
router.get('/public', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    // Nouveaux filtres
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

    // Filtres par tags - Conversion des chaînes en tableaux et filtrage
    const modalityTags = modality ? modality.split(',').filter(Boolean) : [];
    const specialtyTags = specialty ? specialty.split(',').filter(Boolean) : [];
    const locationTags = location ? location.split(',').filter(Boolean) : [];

    if (modalityTags.length > 0) {
      filter.tags = { ...filter.tags, $in: [...(filter.tags?.$in || []), ...modalityTags] };
    }
    if (specialtyTags.length > 0) {
      filter.tags = { ...filter.tags, $in: [...(filter.tags?.$in || []), ...specialtyTags] };
    }
    if (locationTags.length > 0) {
      filter.tags = { ...filter.tags, $in: [...(filter.tags?.$in || []), ...locationTags] };
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

    // Si l'utilisateur est connecté, récupérer ses notes
    let userRatings = {};
    if (req.userId) { // ✅ CORRIGÉ : utiliser req.userId au lieu de req.user
      const userRatingDocs = await QuestionnaireRating.find({ 
        user: req.userId, // ✅ CORRIGÉ : utiliser req.userId au lieu de req.user._id
        questionnaire: { $in: questionnaires.map(q => q._id) }
      });
      
      userRatings = userRatingDocs.reduce((acc, rating) => {
        acc[rating.questionnaire.toString()] = rating.rating;
        return acc;
      }, {});
    }

    // Ajouter les notes utilisateur aux questionnaires
    const questionnairesWithRatings = questionnaires.map(questionnaire => ({
      ...questionnaire,
      averageRating: questionnaire.averageRating || 0,
      ratingsCount: questionnaire.ratingsCount || 0,
      userRating: userRatings[questionnaire._id.toString()] || null,
      views: questionnaire.views || 0,
      copies: questionnaire.copies || 0
    }));

    res.json({
      questionnaires: questionnairesWithRatings,
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
    questionnaire.tags = questionnaire.tags ? 
      questionnaire.tags.filter(t => t !== tagToRemove) : [];
    await questionnaire.save();

    res.json({ tags: questionnaire.tags });
  } catch (error) {
    console.error('Erreur lors de la suppression du tag:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du tag' });
  }
});

// ✅ CORRECTION PRINCIPALE : Route pour créer un questionnaire avec TOUS LES CHAMPS
router.post('/', authMiddleware, async (req, res) => {
  try {
    // ✅ RÉCUPÉRER TOUS LES CHAMPS depuis le corps de la requête
    const { 
      title, 
      questions, 
      selectedOptions, 
      crData, 
      hiddenQuestions,
      pageTitles,    // ✅ AJOUTÉ
      links,         // ✅ AJOUTÉ
      tags,          // ✅ AJOUTÉ
      public         // ✅ AJOUTÉ
    } = req.body;
    
    console.log(`✅ Création du questionnaire : ${title}`);
    console.log('✅ Données reçues:', {
      title,
      questionsCount: questions?.length || 0,
      selectedOptions: Object.keys(selectedOptions || {}).length,
      crData: crData ? 'présent' : 'absent',
      hiddenQuestions: Object.keys(hiddenQuestions || {}).length,
      pageTitles: Object.keys(pageTitles || {}).length,
      linksCount: links ? Object.keys(links).length : 0,
      tagsCount: tags?.length || 0,
      public: public || false
    });

    // ✅ CRÉER le questionnaire avec TOUS LES CHAMPS
    const questionnaire = new Questionnaire({
      title,
      questions: questions || [],
      selectedOptions: selectedOptions || {},
      crData: crData || { crTexts: {}, freeTexts: {} },
      hiddenQuestions: hiddenQuestions || {},
      pageTitles: pageTitles || {},        // ✅ AJOUTÉ
      links: links || new Map(),           // ✅ AJOUTÉ
      tags: tags || [],                    // ✅ AJOUTÉ
      public: public || false,             // ✅ AJOUTÉ
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
      questionsCount: newQuestionnaire.questions?.length || 0
    });
    
    res.status(201).json(newQuestionnaire);
  } catch (error) {
    console.error('❌ Erreur lors de la création du questionnaire:', error);
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
    if (req.userId && questionnaire.public) { // ✅ CORRIGÉ : utiliser req.userId au lieu de req.user
      const userRating = await QuestionnaireRating.findOne({
        questionnaire: req.params.id,
        user: req.userId // ✅ CORRIGÉ : utiliser req.userId au lieu de req.user._id
      });
      questionnaireObject.userRating = userRating ? 
        userRating.rating : null;
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

    console.log('✅ Mise à jour du questionnaire:', req.params.id);
    console.log('✅ Données reçues pour mise à jour:', {
      title: req.body.title,
      questionsCount: req.body.questions?.length || 0,
      selectedOptions: Object.keys(req.body.selectedOptions || {}).length,
      crData: req.body.crData ? 'présent' : 'absent',
      hiddenQuestions: Object.keys(req.body.hiddenQuestions || {}).length
    });

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
    
    console.log('✅ Questionnaire mis à jour avec succès');
    res.json(questionnaire);
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