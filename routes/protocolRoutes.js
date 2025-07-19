const express = require('express');
const router = express.Router();
const Protocol = require('../models/Protocol');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

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

// Route pour récupérer les protocoles publics avec notes
router.get('/public', async (req, res) => {
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

    // Ajouter des propriétés manquantes si nécessaire
    const protocolsWithStats = safeProtocols.map(protocol => ({
      ...protocol,
      views: protocol.stats?.views || 0,
      copies: protocol.stats?.copies || 0,
      likes: protocol.stats?.likes || 0,
      averageRating: protocol.averageRating || 0,
      ratingsCount: protocol.ratingsCount || 0
    }));

    console.log('✅ Réponse envoyée avec', protocolsWithStats.length, 'protocoles');

    res.json({
      protocols: protocolsWithStats,
      currentPage: page,
      totalPages,
      total,
      totalProtocols: total
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des protocoles publics:', error);
    res.status(500).json({
      protocols: [],
      currentPage: 1,
      totalPages: 0,
      total: 0,
      totalProtocols: 0,
      error: error.message
    });
  }
});

// NOUVELLE ROUTE : Obtenir les protocoles les mieux notés
router.get('/top-rated', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const protocols = await Protocol.getTopRated(limit);
    
    res.json({
      protocols,
      message: `Top ${protocols.length} protocoles les mieux notés`
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des protocoles les mieux notés:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des protocoles les mieux notés' });
  }
});

// Route principale pour récupérer les protocoles (avec authentification)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const imagingType = req.query.imagingType || '';
    const anatomicalRegion = req.query.anatomicalRegion || '';

    // Construction du filtre de recherche
    let searchFilter = {
      user: req.userId
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

// Route pour créer un protocole
router.post('/', authMiddleware, async (req, res) => {
  try {
    const protocolData = {
      ...req.body,
      user: req.userId,
      sequences: req.body.sequences || [],
      tags: req.body.tags || []
    };
    
    console.log(`Création du protocole : ${protocolData.title}`);

    const protocol = new Protocol(protocolData);
    const newProtocol = await protocol.save();
    
    res.status(201).json(newProtocol);
  } catch (error) {
    console.error('Erreur lors de la création du protocole:', error);
    res.status(500).json({ message: 'Erreur lors de la création du protocole' });
  }
});

// Route pour récupérer un protocole par ID avec la note de l'utilisateur connecté
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de protocole invalide' });
    }

    const protocol = await Protocol.findOne({
      _id: req.params.id,
      $or: [
        { user: req.userId },
        { public: true }
      ]
    }).populate('user', 'username')
      .populate('ratings.user', 'username');
    
    if (!protocol) {
      return res.status(404).json({ message: 'Protocole non trouvé' });
    }
    
    // Incrémenter les vues si ce n'est pas le propriétaire
    if (protocol.user._id.toString() !== req.userId) {
      await protocol.incrementViews();
    }
    
    // Ajouter la note de l'utilisateur connecté
    const userRating = protocol.getUserRating(req.userId);
    const protocolWithUserRating = {
      ...protocol.toObject(),
      userRating: userRating
    };
    
    res.json(protocolWithUserRating);
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
      originalProtocol.stats.copies += 1;
      await originalProtocol.save();
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

// NOUVELLE ROUTE : Noter un protocole (système principal de notation)
router.post('/:id/rate', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de protocole invalide' });
    }

    const protocol = await Protocol.findOne({
      _id: req.params.id,
      public: true,
      status: 'Validé'
    });

    if (!protocol) {
      return res.status(404).json({ message: 'Protocole non trouvé ou non public' });
    }

    // Vérifier que l'utilisateur ne note pas son propre protocole
    if (protocol.user.toString() === req.userId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas noter votre propre protocole' });
    }

    const { rating, comment } = req.body;

    // Valider la note
    if (rating === undefined || rating === null) {
      return res.status(400).json({ message: 'La note est requise' });
    }

    if (rating < 0 || rating > 10 || (rating * 2) % 1 !== 0) {
      return res.status(400).json({ 
        message: 'La note doit être entre 0 et 10 avec des incréments de 0.5 (ex: 3.5, 7.0, 9.5)' 
      });
    }

    // Ajouter ou mettre à jour la note
    await protocol.addOrUpdateRating(req.userId, rating, comment || '');

    // Récupérer le protocole mis à jour
    const updatedProtocol = await Protocol.findById(req.params.id)
      .populate('user', 'username')
      .populate('ratings.user', 'username');

    const userRating = updatedProtocol.getUserRating(req.userId);
    const hasRated = updatedProtocol.hasUserRated(req.userId);

    res.json({
      message: hasRated ? 'Note mise à jour avec succès' : 'Note ajoutée avec succès',
      averageRating: updatedProtocol.averageRating,
      ratingsCount: updatedProtocol.ratingsCount,
      userRating: userRating,
      protocol: {
        _id: updatedProtocol._id,
        title: updatedProtocol.title,
        averageRating: updatedProtocol.averageRating,
        ratingsCount: updatedProtocol.ratingsCount
      }
    });

  } catch (error) {
    console.error('Erreur lors de la notation du protocole:', error);
    res.status(500).json({ 
      message: error.message || 'Erreur lors de la notation du protocole' 
    });
  }
});

// NOUVELLE ROUTE : Supprimer sa note
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

    // Vérifier que l'utilisateur a bien noté ce protocole
    if (!protocol.hasUserRated(req.userId)) {
      return res.status(400).json({ message: 'Vous n\'avez pas encore noté ce protocole' });
    }

    // Supprimer la note
    await protocol.removeRating(req.userId);

    res.json({
      message: 'Note supprimée avec succès',
      averageRating: protocol.averageRating,
      ratingsCount: protocol.ratingsCount
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la note:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la note' });
  }
});

// NOUVELLE ROUTE : Obtenir les notes d'un protocole
router.get('/:id/ratings', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de protocole invalide' });
    }

    const protocol = await Protocol.findOne({
      _id: req.params.id,
      public: true
    })
    .populate('ratings.user', 'username')
    .select('ratings averageRating ratingsCount title');

    if (!protocol) {
      return res.status(404).json({ message: 'Protocole non trouvé ou non public' });
    }

    // Trier les notes par date (plus récentes en premier)
    const sortedRatings = protocol.ratings.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      ratings: sortedRatings,
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
    if (protocol.hasUserRated(req.userId)) {
      return res.status(400).json({ message: 'Vous avez déjà évalué ce protocole' });
    }

    await protocol.addOrUpdateRating(req.userId, rating, comment);
    res.json({ message: 'Évaluation ajoutée avec succès' });

  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'évaluation:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'évaluation' });
  }
});

module.exports = router;