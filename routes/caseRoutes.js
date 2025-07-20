const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const CaseRating = require('../models/CaseRating'); // NOUVEAU : Import du modèle de notation
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const s3 = require('../src/utils/spacesConfig');

// Configuration de Multer pour l'upload de fichiers
const upload = multer({ storage: multer.memoryStorage() });

// Appliquer le middleware d'authentification à toutes les routes
router.use(authMiddleware);

// Fonction utilitaire pour sanitizer le titre du cas
const sanitizeTitle = (title) => {
  let sanitized = title.trim();
  // Supprimer 'rifim/' s'il est présent
  if (sanitized.toLowerCase().startsWith('rifim/')) {
    sanitized = sanitized.substring(6);
  }
  sanitized = sanitized.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return sanitized;
};

// ==================== ROUTES DE NOTATION POUR LES CAS ====================

// Noter un cas public
router.post('/:id/rate', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const caseId = req.params.id;
    const userId = req.userId; // ✅ CORRIGÉ : utiliser req.userId au lieu de req.user._id

    // Validation des données
    if (rating === undefined || rating === null || rating < 0 || rating > 10) {
      return res.status(400).json({ 
        message: 'La note doit être comprise entre 0 et 10' 
      });
    }

    // Vérifier que le cas existe et est public
    const caseDoc = await Case.findById(caseId);
    if (!caseDoc) {
      return res.status(404).json({ message: 'Cas non trouvé' });
    }

    if (!caseDoc.public) {
      return res.status(403).json({ message: 'Seuls les cas publics peuvent être notés' });
    }

    // Empêcher l'auto-notation
    if (caseDoc.user.toString() === userId) { // ✅ CORRIGÉ : supprimé .toString() sur userId
      return res.status(403).json({ message: 'Vous ne pouvez pas noter votre propre cas' });
    }

    // Vérifier si l'utilisateur a déjà noté ce cas
    let existingRating = await CaseRating.findOne({ 
      case: caseId, 
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
      existingRating = new CaseRating({
        case: caseId,
        user: userId,
        rating: rating,
        comment: comment || '',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await existingRating.save();
    }

    // Recalculer la note moyenne et le nombre de notes
    const allRatings = await CaseRating.find({ case: caseId });
    const averageRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    const ratingsCount = allRatings.length;

    // Mettre à jour le cas avec les nouvelles statistiques
    await Case.findByIdAndUpdate(caseId, {
      averageRating: averageRating,
      ratingsCount: ratingsCount
    });

    res.json({
      averageRating: averageRating,
      ratingsCount: ratingsCount,
      userRating: rating,
      message: 'Note enregistrée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la notation du cas:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la notation' });
  }
});

// Supprimer la note d'un cas
router.delete('/:id/rate', authMiddleware, async (req, res) => {
  try {
    const caseId = req.params.id;
    const userId = req.userId; // ✅ CORRIGÉ : utiliser req.userId au lieu de req.user._id

    // Supprimer la note de l'utilisateur
    const deletedRating = await CaseRating.findOneAndDelete({ 
      case: caseId, 
      user: userId 
    });

    if (!deletedRating) {
      return res.status(404).json({ message: 'Aucune note trouvée pour ce cas' });
    }

    // Recalculer la note moyenne et le nombre de notes
    const allRatings = await CaseRating.find({ case: caseId });
    const averageRating = allRatings.length > 0 
      ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length 
      : 0;
    const ratingsCount = allRatings.length;

    // Mettre à jour le cas avec les nouvelles statistiques
    await Case.findByIdAndUpdate(caseId, {
      averageRating: averageRating,
      ratingsCount: ratingsCount
    });

    res.json({
      averageRating: averageRating,
      ratingsCount: ratingsCount,
      userRating: null,
      message: 'Note supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la note:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
  }
});

// Route pour copier un cas public
router.post('/:id/copy', authMiddleware, async (req, res) => {
  try {
    const caseId = req.params.id;
    const userId = req.userId; // ✅ CORRIGÉ : utiliser req.userId au lieu de req.user._id

    // Vérifier que le cas existe et est public
    const originalCase = await Case.findById(caseId);
    if (!originalCase) {
      return res.status(404).json({ message: 'Cas non trouvé' });
    }

    if (!originalCase.public) {
      return res.status(403).json({ message: 'Seuls les cas publics peuvent être copiés' });
    }

    // Créer une copie du cas pour l'utilisateur
    const newCase = new Case({
      ...originalCase.toObject(),
      _id: undefined,
      title: `${originalCase.title} (copie)`,
      user: userId,
      public: false, // La copie est privée par défaut
      averageRating: 0, // Réinitialiser les notes
      ratingsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newCase.save();

    // Incrémenter le compteur de copies du cas original
    await Case.findByIdAndUpdate(caseId, {
      $inc: { copies: 1 }
    });

    res.json({
      message: 'Cas copié avec succès',
      case: newCase
    });

  } catch (error) {
    console.error('Erreur lors de la copie du cas:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la copie' });
  }
});

// ==================== ROUTES EXISTANTES MODIFIÉES ====================

// GET all cases
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCases = await Case.countDocuments({ user: req.userId });
    const cases = await Case.find({ user: req.userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      cases,
      currentPage: page,
      totalPages: Math.ceil(totalCases / limit),
      totalCases
    });
  } catch (error) {
    console.error('Erreur détaillée lors de la récupération des cas:', error);
    res.status(500).json({ message: error.message });
  }
});

// MODIFIÉ : GET tous les cas publics avec gestion des notes utilisateur
router.get('/public', async (req, res) => {
  console.log("Route /public des cas appelée");
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Récupérer les cas publics avec pagination
    const cases = await Case.find({ public: true })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCases = await Case.countDocuments({ public: true });
    const totalPages = Math.ceil(totalCases / limit);

    // Si l'utilisateur est connecté, récupérer ses notes
    let userRatings = {};
    if (req.userId) { // ✅ CORRIGÉ : utiliser req.userId au lieu de req.user
      const userRatingDocs = await CaseRating.find({ 
        user: req.userId, // ✅ CORRIGÉ : utiliser req.userId au lieu de req.user._id
        case: { $in: cases.map(c => c._id) }
      });
      
      userRatings = userRatingDocs.reduce((acc, rating) => {
        acc[rating.case.toString()] = rating.rating;
        return acc;
      }, {});
    }

    // Ajouter les notes utilisateur aux cas
    const casesWithRatings = cases.map(caseDoc => ({
      ...caseDoc,
      averageRating: caseDoc.averageRating || 0,
      ratingsCount: caseDoc.ratingsCount || 0,
      userRating: userRatings[caseDoc._id.toString()] || null,
      views: caseDoc.views || 0,
      copies: caseDoc.copies || 0
    }));

    res.json({
      cases: casesWithRatings,
      currentPage: page,
      totalPages: totalPages,
      totalCases
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des cas publics:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST new case
router.post('/', async (req, res) => {
  console.log('Tentative de création d\'un nouveau cas:', req.body);
  const newCase = new Case({
    ...req.body,
    user: req.userId,
    averageRating: 0, // NOUVEAU : Initialiser les champs de notation
    ratingsCount: 0,
    views: 0,
    copies: 0
  });

  try {
    const savedCase = await newCase.save();
    console.log('Nouveau cas créé avec succès:', savedCase);
    res.status(201).json(savedCase);
  } catch (error) {
    console.error('Erreur lors de la création du cas:', error);
    res.status(400).json({ message: error.message });
  }
});

// GET cas spécifique
router.get('/:id', async (req, res) => {
  try {
    const caseDoc = await Case.findById(req.params.id);
    
    if (!caseDoc) {
      return res.status(404).json({ message: 'Cas non trouvé' });
    }

    // Si le cas n'est pas public et que l'utilisateur n'est pas le propriétaire
    if (!caseDoc.public && (!req.userId || caseDoc.user.toString() !== req.userId)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Incrémenter le compteur de vues si ce n'est pas le propriétaire
    if (caseDoc.public && req.userId && caseDoc.user.toString() !== req.userId) {
      await Case.findByIdAndUpdate(req.params.id, {
        $inc: { views: 1 }
      });
    }

    const caseObject = caseDoc.toObject();

    if (caseDoc.folderMainImages instanceof Map) {
      caseObject.folderMainImages = Object.fromEntries(caseDoc.folderMainImages);
    } else {
      caseObject.folderMainImages = caseDoc.folderMainImages || {};
    }

    // Ajouter la note de l'utilisateur connecté si applicable
    if (req.userId && caseDoc.public) { // ✅ CORRIGÉ : utiliser req.userId au lieu de req.user
      const userRating = await CaseRating.findOne({
        case: req.params.id,
        user: req.userId // ✅ CORRIGÉ : utiliser req.userId au lieu de req.user._id
      });
      caseObject.userRating = userRating ? userRating.rating : null;
    }

    res.json(caseObject);
  } catch (error) {
    console.error('Erreur lors de la récupération du cas:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST new folder to a case
router.post('/:id/folders', async (req, res) => {
  console.log('Tentative d\'ajout d\'un nouveau dossier:', req.body);
  try {
    const caseDoc = await Case.findOne({ _id: req.params.id, user: req.userId });
    if (!caseDoc) {
      console.log('Cas non trouvé pour l\'ajout du dossier:', req.params.id);
      return res.status(404).json({ message: 'Cas non trouvé' });
    }

    const folderName = req.body.folderName;
    if (!caseDoc.folders.includes(folderName)) {
      caseDoc.folders.push(folderName);
      caseDoc.images[folderName] = [];
    }

    const updatedCase = await caseDoc.save();
    console.log('Dossier ajouté avec succès:', folderName);
    res.json(updatedCase);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du dossier:', error);
    res.status(400).json({ message: error.message });
  }
});

// POST images to a case
router.post('/:id/images', upload.array('images'), async (req, res) => {
  console.log('Tentative d\'ajout d\'images:', req.params.id, req.body.folder);
  try {
    const caseDoc = await Case.findOne({ _id: req.params.id, user: req.userId });
    if (!caseDoc) {
      console.log('Cas non trouvé pour l\'ajout d\'images:', req.params.id);
      return res.status(404).json({ message: 'Cas non trouvé' });
    }

    const { folder } = req.body;
    const caseTitle = sanitizeTitle(caseDoc.title);
    const uploadPromises = req.files.map(file => {
      const params = {
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: `rifim/${caseTitle}/${folder}/${file.originalname}`,
        Body: file.buffer,
        ACL: 'public-read'
      };
      return s3.upload(params).promise().then(result => {
        // Construire l'URL publique de l'image
        let endpoint = process.env.DO_SPACES_ENDPOINT;
        if (!endpoint.startsWith('http')) {
          endpoint = `https://${endpoint}`;
        }
        const imageUrl = `${endpoint}/${params.Key}`;
        return imageUrl;
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    if (!caseDoc.images) {
      caseDoc.images = {};
    }

    if (!caseDoc.images[folder]) {
      caseDoc.images[folder] = [];
    }

    caseDoc.images[folder].push(...imageUrls);
    caseDoc.markModified('images');

    const updatedCase = await caseDoc.save();
    console.log('Images ajoutées avec succès:', imageUrls);
    res.json(updatedCase);
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'images:', error);
    res.status(400).json({ message: error.message });
  }
});

// POST main image for a case
router.post('/:id/main-image', upload.single('mainImage'), async (req, res) => {
  console.log('Tentative de définition de l\'image principale:', req.params.id);
  try {
    const caseDoc = await Case.findOne({ _id: req.params.id, user: req.userId });
    if (!caseDoc) {
      console.log('Cas non trouvé pour l\'image principale:', req.params.id);
      return res.status(404).json({ message: 'Cas non trouvé' });
    }

    const caseTitle = sanitizeTitle(caseDoc.title);
    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: `rifim/${caseTitle}/main-image/${req.file.originalname}`,
      Body: req.file.buffer,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    console.log('Image principale uploadée:', result.Location);
    
    // Construire l'URL publique de l'image
    const imageUrl = `${process.env.DO_SPACES_ENDPOINT}/${params.Key}`;
    
    caseDoc.mainImage = imageUrl;
    const updatedCase = await caseDoc.save();
    console.log('Image principale mise à jour avec succès');
    res.json(updatedCase);
  } catch (error) {
    console.error('Erreur lors de la définition de l\'image principale:', error);
    res.status(400).json({ message: error.message });
  }
});

// POST image principale pour un dossier
router.post('/:id/folder-main-image', upload.single('folderMainImage'), async (req, res) => {
  console.log('Tentative de définition de l\'image principale du dossier:', req.params.id, req.body.folder);
  try {
    const caseDoc = await Case.findOne({ _id: req.params.id, user: req.userId });
    if (!caseDoc) {
      console.log('Cas non trouvé pour l\'image principale du dossier:', req.params.id);
      return res.status(404).json({ message: 'Cas non trouvé' });
    }
    const folder = req.body.folder;
    const caseTitle = sanitizeTitle(caseDoc.title);
    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: `rifim/${caseTitle}/${folder}/folder-main-image/${req.file.originalname}`,
      Body: req.file.buffer,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    console.log('Image principale du dossier uploadée:', result.Location);
    
    // Construire l'URL publique de l'image
    const imageUrl = `${process.env.DO_SPACES_ENDPOINT}/${params.Key}`;
    
    // Mettre à jour correctement la Map
    if (!caseDoc.folderMainImages) {
      caseDoc.folderMainImages = new Map();
    }
    caseDoc.folderMainImages.set(folder, imageUrl);
    
    caseDoc.markModified('folderMainImages');
    
    const updatedCase = await caseDoc.save();
    console.log('Image principale du dossier mise à jour avec succès');
    res.json(updatedCase);
  } catch (error) {
    console.error('Erreur lors de la définition de l\'image principale du dossier:', error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE image from a case
router.delete('/:id/images', async (req, res) => {
  console.log('Tentative de suppression d\'image:', req.params.id, req.body);
  try {
    const { folder, fileName } = req.body;
    const caseDoc = await Case.findOne({ _id: req.params.id, user: req.userId });
    if (!caseDoc) {
      console.log('Cas non trouvé pour la suppression d\'image:', req.params.id);
      return res.status(404).json({ message: 'Cas non trouvé' });
    }

    if (!caseDoc.images[folder]) {
      console.log('Dossier non trouvé pour la suppression d\'image:', folder);
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }

    const imagePath = `${folder}/${fileName}`;
    const imageIndex = caseDoc.images[folder].findIndex(path => path.endsWith(fileName));
    if (imageIndex === -1) {
      console.log('Image non trouvée pour la suppression:', fileName);
      return res.status(404).json({ message: 'Image non trouvée' });
    }

    // Suppression de l'image de la base de données
    caseDoc.images[folder].splice(imageIndex, 1);
    caseDoc.markModified('images');
    await caseDoc.save();

    // Suppression de l'image de DigitalOcean Spaces
    const key = `rifim/${caseDoc.title}/${imagePath}`;
    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: key
    };

    await s3.deleteObject(params).promise();
    console.log('Image supprimée avec succès:', key);

    res.json(caseDoc);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE a case
router.delete('/:id', async (req, res) => {
  console.log('Tentative de suppression du cas:', req.params.id);
  try {
    const deletedCase = await Case.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deletedCase) {
      console.log('Cas non trouvé pour la suppression:', req.params.id);
      return res.status(404).json({ message: 'Cas non trouvé' });
    }

    // Supprimer aussi toutes les notes associées à ce cas
    await CaseRating.deleteMany({ case: req.params.id });

    // Suppression des images de DigitalOcean Spaces
    const folder = sanitizeTitle(deletedCase.title);
    const listParams = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Prefix: `rifim/${folder}/`
    };

    try {
      const listedObjects = await s3.listObjectsV2(listParams).promise();
      if (listedObjects.Contents.length > 0) {
        const deleteParams = {
          Bucket: process.env.DO_SPACES_BUCKET,
          Delete: { Objects: [] }
        };

        listedObjects.Contents.forEach(({ Key }) => {
          deleteParams.Delete.Objects.push({ Key });
        });

        await s3.deleteObjects(deleteParams).promise();
        console.log('Images associées supprimées avec succès');
      }
    } catch (spaceError) {
      console.error('Erreur lors de la suppression des images dans Spaces:', spaceError);
    }

    console.log('Cas supprimé avec succès:', req.params.id);
    res.json({ message: 'Cas et images associées supprimés avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du cas:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du cas', error: error.message });
  }
});

// DELETE a folder from a case
router.delete('/:id/folders/:folder', async (req, res) => {
  console.log('Tentative de suppression du dossier:', req.params.id, req.params.folder);
  try {
    const caseDoc = await Case.findOne({ _id: req.params.id, user: req.userId });
    if (!caseDoc) {
      console.log('Cas non trouvé pour la suppression du dossier:', req.params.id);
      return res.status(404).json({ message: 'Cas non trouvé' });
    }

    const folder = req.params.folder;
    const sanitizedCaseTitle = sanitizeTitle(caseDoc.title);

    caseDoc.folders = caseDoc.folders.filter(f => f !== folder);

    if (caseDoc.images[folder]) {
      delete caseDoc.images[folder];
    }

    if (caseDoc.folderMainImages && caseDoc.folderMainImages[folder]) {
      delete caseDoc.folderMainImages[folder];
    }

    // Suppression des images du dossier dans DigitalOcean Spaces
    const listParams = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Prefix: `rifim/${sanitizedCaseTitle}/${folder}/`
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();
    if (listedObjects.Contents.length > 0) {
      const deleteParams = {
        Bucket: process.env.DO_SPACES_BUCKET,
        Delete: { Objects: [] }
      };
      listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
      });
      await s3.deleteObjects(deleteParams).promise();
      console.log('Images du dossier supprimées avec succès');
    }

    await caseDoc.save();
    console.log('Dossier supprimé avec succès:', folder);
    res.json(caseDoc);
  } catch (error) {
    console.error('Erreur lors de la suppression du dossier:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du dossier', error: error.message });
  }
});

// PATCH pour rendre un cas public/privé
router.patch('/:id/togglePublic', authMiddleware, async (req, res) => {
  console.log("Route /togglePublic appelée pour le cas:", req.params.id);
  try {
    const caseDoc = await Case.findOne({ _id: req.params.id, user: req.userId });
    if (!caseDoc) {
      return res.status(404).json({ message: 'Cas non trouvé' });
    }
    caseDoc.public = !caseDoc.public;
    await caseDoc.save();
    res.json(caseDoc);
  } catch (error) {
    console.error('Erreur lors du basculement de la visibilité:', error);
    res.status(500).json({ message: error.message });
  }
});

// PATCH update case difficulty
router.patch('/:id', async (req, res) => {
  console.log('Tentative de mise à jour du cas:', req.params.id, req.body);
  try {
    const { difficulty, answer, sheet } = req.body;
    const updatedCase = await Case.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { difficulty, answer, sheet },
      { new: true }
    );

    if (!updatedCase) {
      console.log('Cas non trouvé pour la mise à jour:', req.params.id);
      return res.status(404).json({ message: 'Cas non trouvé' });
    }

    console.log('Cas mis à jour avec succès:', updatedCase);
    res.json(updatedCase);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du cas:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du cas', error: error.message });
  }
});

router.patch('/:id/tags', async (req, res) => {
  console.log('Tentative de mise à jour des tags:', req.params.id, req.body);
  try {
    const { tagToAdd, tagToRemove } = req.body;
    const caseDoc = await Case.findOne({ _id: req.params.id, user: req.userId });
    
    if (!caseDoc) {
      console.log('Cas non trouvé pour la mise à jour des tags:', req.params.id);
      return res.status(404).json({ message: 'Cas non trouvé' });
    }

    if (tagToAdd && !caseDoc.tags.includes(tagToAdd)) {
      caseDoc.tags.push(tagToAdd);
      console.log('Tag ajouté:', tagToAdd);
    }

    if (tagToRemove) {
      caseDoc.tags = caseDoc.tags.filter(tag => tag !== tagToRemove);
      console.log('Tag supprimé:', tagToRemove);
    }

    await caseDoc.save();
    console.log('Tags mis à jour avec succès');
    res.json(caseDoc);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des tags:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST images for a sheet
router.post('/:id/sheet-images', upload.single('file'), async (req, res) => {
  console.log('Tentative d\'upload d\'image pour la fiche:', req.params.id);
  try {
    const caseDoc = await Case.findOne({ _id: req.params.id, user: req.userId });
    if (!caseDoc) {
      console.log('Cas non trouvé pour l\'upload d\'image de fiche:', req.params.id);
      return res.status(404).json({ message: 'Cas non trouvé' });
    }

    const file = req.file;
    if (!file) {
      console.log('Aucun fichier n\'a été téléchargé');
      return res.status(400).json({ message: 'Aucun fichier n\'a été téléchargé.' });
    }

    const caseTitle = caseDoc.title.trim();
    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: `rifim/${caseTitle}/fiche/${file.originalname}`,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    };

    const result = await s3.upload(params).promise();
    console.log('Image de fiche uploadée avec succès:', result.Location);

    res.json({ location: result.Location });
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image de la fiche:', error);
    res.status(500).json({ message: 'Erreur lors du téléchargement de l\'image' });
  }
});

// GET sheet for a case
router.get('/:id/sheet', async (req, res) => {
  console.log('Tentative de récupération de la fiche:', req.params.id);
  try {
    const caseDoc = await Case.findOne({ _id: req.params.id, user: req.userId });
    if (!caseDoc) {
      console.log('Cas non trouvé pour la récupération de la fiche:', req.params.id);
      return res.status(404).json({ message: 'Cas non trouvé' });
    }
    console.log('Fiche récupérée avec succès');
    res.json({ title: caseDoc.title, content: caseDoc.sheet });
  } catch (error) {
    console.error('Erreur lors de la récupération de la fiche:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST update sheet for a case
router.post('/:id/sheet', async (req, res) => {
  console.log('Tentative de mise à jour de la fiche:', req.params.id);
  try {
    const { title, content } = req.body;
    const caseDoc = await Case.findOne({ _id: req.params.id, user: req.userId });
    if (!caseDoc) {
      console.log('Cas non trouvé pour la mise à jour de la fiche:', req.params.id);
      return res.status(404).json({ message: 'Cas non trouvé' });
    }
    caseDoc.title = title;
    caseDoc.sheet = content;
    await caseDoc.save();
    console.log('Fiche mise à jour avec succès');
    res.json({ message: 'Fiche mise à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la fiche:', error);
    res.status(500).json({ message: error.message });
  }
});

// PATCH pour réorganiser les images
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { images } = req.body;
    const updatedCase = await Case.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: { images } },
      { new: true }
    );
    
    if (!updatedCase) {
      return res.status(404).json({ message: 'Cas non trouvé' });
    }
    
    res.json(updatedCase);
  } catch (error) {
    console.error('Erreur lors de la réorganisation des images:', error);
    res.status(500).json({ message: error.message });
  }
});

// Dans caseRoutes.js, ajoutez une nouvelle route spécifique pour la réorganisation des images
router.patch('/:id/reorder-images', authMiddleware, async (req, res) => {
  try {
    const { folder, images } = req.body;
    const caseDoc = await Case.findOne({ _id: req.params.id, user: req.userId });

    if (!caseDoc) {
      return res.status(404).json({ message: 'Cas non trouvé' });
    }

    caseDoc.images[folder] = images;
    caseDoc.markModified('images'); // Important pour les objets imbriqués

    const updatedCase = await caseDoc.save();
    res.json(updatedCase);
  } catch (error) {
    console.error('Erreur lors de la réorganisation des images:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;