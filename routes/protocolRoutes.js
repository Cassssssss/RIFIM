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

// Route pour récupérer les protocoles publics
router.get('/public', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const imagingType = req.query.imagingType || '';
    const anatomicalRegion = req.query.anatomicalRegion || '';
    const complexity = req.query.complexity || '';

    // Construction du filtre de recherche
    let searchFilter = {
      public: true,
      status: 'Validé' // Seuls les protocoles validés sont visibles publiquement
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

    // Compter le total
    const total = await Protocol.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);

    // Récupérer les protocoles avec pagination
    const protocols = await Protocol.find(searchFilter)
      .populate('user', 'username')
      .sort({ 'stats.views': -1, updatedAt: -1 }) // Trier par popularité puis date
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

// Route pour récupérer un protocole par ID
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
    }).populate('user', 'username');
    
    if (!protocol) {
      return res.status(404).json({ message: 'Protocole non trouvé' });
    }
    
    // Incrémenter les vues si ce n'est pas le propriétaire
    if (protocol.user._id.toString() !== req.userId) {
      await protocol.incrementViews();
    }
    
    res.json(protocol);
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
      if (key !== 'user' && key !== 'changeDescription') {
        protocol[key] = req.body[key];
      }
    });

    const updatedProtocol = await protocol.save();
    res.json(updatedProtocol);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du protocole:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du protocole' });
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
      reviews: [],
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

// Route pour ajouter une évaluation à un protocole
router.post('/:id/review', authMiddleware, async (req, res) => {
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

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Note invalide (1-5)' });
    }

    // Vérifier si l'utilisateur a déjà évalué ce protocole
    const existingReview = protocol.reviews.find(
      review => review.user.toString() === req.userId
    );

    if (existingReview) {
      return res.status(400).json({ message: 'Vous avez déjà évalué ce protocole' });
    }

    await protocol.addReview(req.userId, rating, comment);
    res.json({ message: 'Évaluation ajoutée avec succès' });

  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'évaluation:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'évaluation' });
  }
});

module.exports = router;