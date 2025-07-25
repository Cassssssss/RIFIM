const express = require('express');
const router = express.Router();
const Protocol = require('../models/Protocol');
const ProtocolRating = require('../models/ProtocolRating'); // Import du modèle de notation
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// NOUVEAU : Middleware d'authentification optionnel
const optionalAuthMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    // Pas de token = utilisateur non connecté, on continue quand même
    req.userId = null;
    return next();
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    // Token invalide = utilisateur non connecté, on continue quand même
    req.userId = null;
    next();
  }
};

// IMPORTANT: Les routes spécifiques DOIVENT être avant les routes avec paramètres

// Route pour récupérer les protocoles de l'utilisateur connecté
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const imagingType = req.query.imagingType || '';
    const anatomicalRegion = req.query.anatomicalRegion || '';
    const complexity = req.query.complexity || '';

    // Construction du filtre de recherche
    let searchFilter = {
      user: req.userId // Protocoles de l'utilisateur connecté uniquement
    };

    // Recherche textuelle
    if (search.trim()) {
      searchFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { indication: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtres spécifiques
    if (imagingType) searchFilter.imagingType = imagingType;
    if (anatomicalRegion) searchFilter.anatomicalRegion = anatomicalRegion;
    if (complexity) searchFilter.complexity = parseInt(complexity);

    console.log('Filtre de recherche protocoles:', searchFilter);

    // Compter le total
    const total = await Protocol.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);

    // Récupérer les protocoles avec pagination
    const protocols = await Protocol.find(searchFilter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // S'assurer que protocols est toujours un tableau
    const safeProtocols = Array.isArray(protocols) ? protocols : [];

    res.json({
      protocols: safeProtocols,
      currentPage: page,
      totalPages,
      total,
      totalProtocols: total
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des protocoles:', error);
    res.json({
      protocols: [],
      currentPage: 1,
      totalPages: 0,
      total: 0,
      totalProtocols: 0
    });
  }
});

// Route pour récupérer les protocoles publics avec notes - AUTHENTIFICATION OPTIONNELLE
router.get('/public', optionalAuthMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const imagingType = req.query.imagingType || '';
    const anatomicalRegion = req.query.anatomicalRegion || '';
    const complexity = req.query.complexity || '';
    const sortBy = req.query.sortBy || 'popular';

    // Construction du filtre de recherche
    let searchFilter = {
      public: true,
      status: 'Validé' // Seuls les protocoles validés sont visibles publiquement
    };

    console.log('🔍 Recherche de protocoles publics avec filtre:', searchFilter);
    console.log('👤 Utilisateur connecté:', !!req.userId);

    // Recherche textuelle
    if (search.trim()) {
      searchFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { indication: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtres spécifiques
    if (imagingType) searchFilter.imagingType = imagingType;
    if (anatomicalRegion) searchFilter.anatomicalRegion = anatomicalRegion;
    if (complexity) searchFilter.complexity = parseInt(complexity);

    console.log('🔍 Filtre final:', searchFilter);

    // Définir le tri selon le paramètre sortBy
    let sortOptions = {};
    switch (sortBy) {
      case 'recent':
        sortOptions = { updatedAt: -1 };
        break;
      case 'alphabetical':
        sortOptions = { title: 1 };
        break;
      case 'rating':
        sortOptions = { averageRating: -1, ratingsCount: -1, updatedAt: -1 };
        break;
      case 'popular':
      default:
        sortOptions = { 'stats.views': -1, 'stats.copies': -1, averageRating: -1, updatedAt: -1 };
        break;
    }

    // Compter le total
    const total = await Protocol.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);

    console.log('📊 Total protocoles publics trouvés:', total);

    // Récupérer les protocoles avec pagination
    const protocols = await Protocol.find(searchFilter)
      .populate('user', 'username')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    console.log('📋 Protocoles récupérés:', protocols.length);

    // S'assurer que protocols est toujours un tableau
    const safeProtocols = Array.isArray(protocols) ? protocols : [];

    // Ajouter les notes utilisateur si connecté
    const protocolsWithUserRatings = await Promise.all(safeProtocols.map(async (protocol) => {
      const protocolObject = { ...protocol };
      
      if (req.userId) {
        try {
          const userRating = await ProtocolRating.findOne({
            protocol: protocol._id,
            user: req.userId
          });
          protocolObject.userRating = userRating ? userRating.rating : null;
        } catch (ratingError) {
          console.log('Erreur lors de la récupération de la note utilisateur:', ratingError.message);
          protocolObject.userRating = null;
        }
      }
      
      return protocolObject;
    }));

    res.json({
      protocols: protocolsWithUserRatings,
      currentPage: page,
      totalPages,
      total,
      totalProtocols: total
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des protocoles publics:', error);
    res.json({
      protocols: [],
      currentPage: 1,
      totalPages: 0,
      total: 0,
      totalProtocols: 0
    });
  }
});

// ✅ ROUTE POST MANQUANTE - AJOUT CRITIQUE POUR LA CRÉATION DE PROTOCOLES
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log(`[rifim] Création du protocole : ${req.body.title}`);
    console.log('Données complètes:', req.body);

    const protocolData = {
      ...req.body,
      user: req.userId,
      sequences: req.body.sequences || [],
      tags: req.body.tags || [],
      // Initialiser tous les champs obligatoires
      public: req.body.public || false,
      status: req.body.status || 'Brouillon',
      version: req.body.version || '1.0',
      changelog: [],
      stats: { 
        views: 0, 
        likes: 0, 
        copies: 0 
      },
      ratings: [], // Système de notation intégré
      averageRating: 0,
      ratingsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log(`Création du protocole : ${protocolData.title}`);
    console.log('Données complètes:', protocolData);

    const protocol = new Protocol(protocolData);
    const newProtocol = await protocol.save();
    
    console.log('✅ Protocole créé avec succès:', newProtocol._id);
    res.status(201).json(newProtocol);
    
  } catch (error) {
    console.error('Erreur détaillée lors de la création du protocole:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création du protocole',
      error: error.message,
      details: error.errors // Afficher les erreurs de validation Mongoose
    });
  }
});

// Route pour récupérer un protocole par ID avec la note de l'utilisateur connecté - AUTHENTIFICATION OPTIONNELLE
router.get('/:id', optionalAuthMiddleware, async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de protocole invalide' });
    }

    // Construire le filtre selon si l'utilisateur est connecté ou non
    let filter = { _id: req.params.id };
    
    if (req.userId) {
      // Utilisateur connecté : peut voir ses propres protocoles + les publics
      filter = {
        _id: req.params.id,
        $or: [
          { user: req.userId },
          { public: true }
        ]
      };
    } else {
      // Utilisateur non connecté : seulement les protocoles publics
      filter = {
        _id: req.params.id,
        public: true
      };
    }

    const protocol = await Protocol.findOne(filter).populate('user', 'username');
    
    if (!protocol) {
      return res.status(404).json({ message: 'Protocole non trouvé ou non accessible' });
    }
    
    // Incrémenter les vues si ce n'est pas le propriétaire
    if (protocol.public && req.userId && protocol.user._id.toString() !== req.userId) {
      await Protocol.findByIdAndUpdate(req.params.id, {
        $inc: { 'stats.views': 1 }
      });
    }
    
    const protocolObject = protocol.toObject();

    // Ajouter la note de l'utilisateur connecté si applicable
    if (req.userId && protocol.public) {
      try {
        const userRating = await ProtocolRating.findOne({
          protocol: req.params.id,
          user: req.userId
        });
        protocolObject.userRating = userRating ? userRating.rating : null;
      } catch (ratingError) {
        console.log('Erreur lors de la récupération de la note utilisateur:', ratingError.message);
        protocolObject.userRating = null;
      }
    }
    
    res.json(protocolObject);
  } catch (error) {
    console.error('Erreur lors de la récupération du protocole:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du protocole' });
  }
});

// Route pour mettre à jour un protocole
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de protocole invalide' });
    }

    const protocol = await Protocol.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!protocol) {
      return res.status(404).json({ message: 'Protocole non trouvé ou accès non autorisé' });
    }

    // Sauvegarder une entrée dans l'historique des modifications
    if (req.body.version && req.body.version !== protocol.version) {
      protocol.changelog.push({
        version: protocol.version,
        changes: req.body.changeDescription || 'Modification du protocole',
        author: req.userId
      });
    }

    // Mettre à jour les champs
    Object.keys(req.body).forEach(key => {
      if (key !== 'user' && key !== 'changeDescription' && key !== 'ratings' && key !== 'averageRating' && key !== 'ratingsCount') {
        protocol[key] = req.body[key];
      }
    });

    const updatedProtocol = await protocol.save();
    
    console.log('✅ Protocole mis à jour:', updatedProtocol.title, 'Public:', updatedProtocol.public);
    
    res.json(updatedProtocol);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du protocole:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du protocole' });
  }
});

// Route PATCH séparée pour changer la visibilité (optionnelle - garde les deux pour compatibilité)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de protocole invalide' });
    }

    const protocol = await Protocol.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!protocol) {
      return res.status(404).json({ message: 'Protocole non trouvé' });
    }

    // Mettre à jour seulement les champs fournis (sauf les champs de notation)
    Object.keys(req.body).forEach(key => {
      if (key !== 'user' && key !== 'ratings' && key !== 'averageRating' && key !== 'ratingsCount') {
        protocol[key] = req.body[key];
      }
    });

    await protocol.save();
    
    console.log('✅ Protocole modifié (PATCH):', protocol.title, 'Public:', protocol.public);
    
    res.json(protocol);
  } catch (error) {
    console.error('Erreur lors du changement de visibilité:', error);
    res.status(500).json({ message: 'Erreur lors du changement de visibilité' });
  }
});

// Route pour changer la visibilité d'un protocole
router.patch('/:id/visibility', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de protocole invalide' });
    }

    const protocol = await Protocol.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!protocol) {
      return res.status(404).json({ message: 'Protocole non trouvé' });
    }

    protocol.public = req.body.public;
    
    // Si on rend public, s'assurer que le statut est validé
    if (req.body.public) {
      protocol.status = 'Validé';
    }

    await protocol.save();
    res.json({ public: protocol.public, status: protocol.status });
  } catch (error) {
    console.error('Erreur lors du changement de visibilité:', error);
    res.status(500).json({ message: 'Erreur lors du changement de visibilité' });
  }
});

// Route pour supprimer un protocole
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de protocole invalide' });
    }

    const protocol = await Protocol.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!protocol) {
      return res.status(404).json({ message: 'Protocole non trouvé' });
    }

    // Supprimer aussi toutes les notes associées à ce protocole
    await ProtocolRating.deleteMany({ protocol: req.params.id });
    
    res.json({ message: 'Protocole supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du protocole:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du protocole' });
  }
});

// Route pour copier un protocole
router.post('/:id/copy', authMiddleware, async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de protocole invalide' });
    }

    const originalProtocol = await Protocol.findOne({
      _id: req.params.id,
      $or: [
        { user: req.userId },
        { public: true }
      ]
    });

    if (!originalProtocol) {
      return res.status(404).json({
        message: 'Protocole non trouvé ou accès non autorisé'
      });
    }

    const newProtocol = new Protocol({
      ...originalProtocol.toObject(),
      _id: undefined,
      title: `${originalProtocol.title} (copie)`,
      public: false,
      user: req.userId,
      status: 'Brouillon',
      version: '1.0',
      changelog: [],
      stats: { views: 0, likes: 0, copies: 0 },
      ratings: [], // Pas de notes copiées
      averageRating: 0,
      ratingsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newProtocol.save();

    // Incrémenter le compteur de copies du protocole original
    if (originalProtocol.user.toString() !== req.userId) {
      await Protocol.findByIdAndUpdate(req.params.id, {
        $inc: { 'stats.copies': 1 }
      });
    }

    res.status(201).json({
      message: 'Protocole copié avec succès',
      id: newProtocol._id,
      protocol: newProtocol
    });

  } catch (error) {
    console.error('Erreur lors de la copie du protocole:', error);
    res.status(500).json({ message: 'Erreur lors de la copie du protocole' });
  }
});

// SYSTÈME DE NOTATION SIMPLIFIÉ - VERSION CORRIGÉE AVEC AUTHENTIFICATION OBLIGATOIRE

// Noter un protocole public - AUTHENTIFICATION OBLIGATOIRE
router.post('/:id/rate', authMiddleware, async (req, res) => {
  try {
    console.log('=== DÉBUT NOTATION PROTOCOLE ===');
    console.log('Protocol ID:', req.params.id);
    console.log('User ID:', req.userId);
    console.log('Rating data:', req.body);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de protocole invalide' });
    }

    const protocol = await Protocol.findOne({
      _id: req.params.id,
      public: true
    });

    console.log('Protocol trouvé:', !!protocol);

    if (!protocol) {
      return res.status(404).json({ message: 'Protocole non trouvé ou non public' });
    }

    // Empêcher l'auto-notation
    if (protocol.user.toString() === req.userId) {
      return res.status(403).json({ message: 'Vous ne pouvez pas noter votre propre protocole' });
    }

    const { rating, comment } = req.body;

    // Validation de la note
    if (rating === undefined || rating === null || rating < 0 || rating > 10) {
      return res.status(400).json({ message: 'La note doit être comprise entre 0 et 10' });
    }

    console.log('Validation réussie, note:', rating);

    // Vérifier si l'utilisateur a déjà noté ce protocole
    let existingRating = await ProtocolRating.findOne({
      protocol: req.params.id,
      user: req.userId
    });

    if (existingRating) {
      console.log('Mise à jour de la note existante');
      // Mettre à jour la note existante
      const oldRating = existingRating.rating;
      existingRating.rating = rating;
      existingRating.comment = comment || '';
      existingRating.updatedAt = new Date();
      await existingRating.save();

      console.log(`Note mise à jour: ${oldRating} -> ${rating}`);
    } else {
      console.log('Création d\'une nouvelle note');
      // Créer une nouvelle note
      existingRating = new ProtocolRating({
        protocol: req.params.id,
        user: req.userId,
        rating: rating,
        comment: comment || '',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await existingRating.save();
      console.log('Nouvelle note créée');
    }

    // Recalculer les statistiques du protocole
    console.log('Recalcul des statistiques...');
    const allRatings = await ProtocolRating.find({ protocol: req.params.id });
    const averageRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    const ratingsCount = allRatings.length;

    console.log(`Nouvelles stats: moyenne=${averageRating}, count=${ratingsCount}`);

    // Mettre à jour le protocole avec les nouvelles statistiques
    await Protocol.findByIdAndUpdate(req.params.id, {
      averageRating: Number(averageRating.toFixed(1)),
      ratingsCount: ratingsCount
    });

    console.log('=== FIN NOTATION PROTOCOLE - SUCCÈS ===');

    res.json({
      message: 'Note ajoutée avec succès',
      averageRating: Number(averageRating.toFixed(1)),
      ratingsCount: ratingsCount,
      userRating: rating
    });

  } catch (error) {
    console.error('=== ERREUR NOTATION PROTOCOLE ===', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la note' });
  }
});

// Supprimer sa propre note d'un protocole
router.delete('/:id/rate', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de protocole invalide' });
    }

    const protocol = await Protocol.findOne({
      _id: req.params.id,
      public: true
    });

    if (!protocol) {
      return res.status(404).json({ message: 'Protocole non trouvé ou non public' });
    }

    // Supprimer la note de l'utilisateur
    const deletedRating = await ProtocolRating.findOneAndDelete({
      protocol: req.params.id,
      user: req.userId
    });

    if (!deletedRating) {
      return res.status(404).json({ message: 'Aucune note trouvée pour ce protocole' });
    }

    // Recalculer les statistiques
    const allRatings = await ProtocolRating.find({ protocol: req.params.id });
    const averageRating = allRatings.length > 0 ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length : 0;
    const ratingsCount = allRatings.length;

    await Protocol.findByIdAndUpdate(req.params.id, {
      averageRating: Number(averageRating.toFixed(1)),
      ratingsCount: ratingsCount
    });

    res.json({
      message: 'Note supprimée avec succès',
      averageRating: Number(averageRating.toFixed(1)),
      ratingsCount: ratingsCount
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la note:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la note' });
  }
});

// Récupérer toutes les notes d'un protocole
router.get('/:id/ratings', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de protocole invalide' });
    }

    const protocol = await Protocol.findById(req.params.id);
    if (!protocol) {
      return res.status(404).json({ message: 'Protocole non trouvé' });
    }

    // Récupérer toutes les notes avec les informations utilisateur
    const ratings = await ProtocolRating.find({ protocol: req.params.id })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      ratings: ratings,
      averageRating: protocol.averageRating,
      ratingsCount: protocol.ratingsCount,
      protocolTitle: protocol.title
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des notes' });
  }
});

// Route pour ajouter une évaluation à un protocole (ancienne méthode - maintenant dépréciée)
router.post('/:id/review', authMiddleware, async (req, res) => {
  console.warn('La route /review est dépréciée, utilisez /rate à la place');
  
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de protocole invalide' });
    }

    const protocol = await Protocol.findOne({
      _id: req.params.id,
      public: true
    });

    if (!protocol) {
      return res.status(404).json({ message: 'Protocole non trouvé ou non public' });
    }

    const { rating, comment } = req.body;

    if (!rating || rating < 0 || rating > 10) {
      return res.status(400).json({ message: 'Note invalide (0-10)' });
    }

    // Vérifier si l'utilisateur a déjà évalué ce protocole
    const existingRating = await ProtocolRating.findOne({
      protocol: req.params.id,
      user: req.userId
    });

    if (existingRating) {
      return res.status(400).json({ message: 'Vous avez déjà évalué ce protocole' });
    }

    // Créer une nouvelle note
    const newRating = new ProtocolRating({
      protocol: req.params.id,
      user: req.userId,
      rating: rating,
      comment: comment || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newRating.save();

    // Recalculer les statistiques
    const allRatings = await ProtocolRating.find({ protocol: req.params.id });
    const averageRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    const ratingsCount = allRatings.length;

    await Protocol.findByIdAndUpdate(req.params.id, {
      averageRating: averageRating,
      ratingsCount: ratingsCount
    });

    res.json({ message: 'Évaluation ajoutée avec succès' });

  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'évaluation:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'évaluation' });
  }
});

module.exports = router;