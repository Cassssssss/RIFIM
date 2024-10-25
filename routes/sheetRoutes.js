const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const s3 = require('../src/utils/spacesConfig');

router.use(authMiddleware);

// Récupérer la fiche d'un cas
router.get('/:caseId/sheet', async (req, res) => {
  try {
    const caseDoc = await Case.findOne({ _id: req.params.caseId, user: req.userId });
    if (!caseDoc) {
      return res.status(404).json({ message: 'Cas non trouvé' });
    }
    res.json({ content: caseDoc.sheet, title: caseDoc.title });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer ou mettre à jour la fiche d'un cas
router.post('/:caseId/sheet', async (req, res) => {
  try {
    const caseDoc = await Case.findOne({ _id: req.params.caseId, user: req.userId });
    if (!caseDoc) {
      return res.status(404).json({ message: 'Cas non trouvé' });
    }
    const { title, content } = req.body;
    caseDoc.title = title;
    caseDoc.sheet = content;
    await caseDoc.save();
    res.json({ message: 'Fiche sauvegardée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ajouter une image à la fiche
router.post('/:caseId/sheet-images', async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ message: 'Aucun fichier reçu.' });
  }

  try {
    const caseDoc = await Case.findOne({ _id: req.params.caseId, user: req.userId });
    if (!caseDoc) {
      return res.status(404).json({ message: 'Cas non trouvé' });
    }

    const file = req.files.file;
    const sanitizedTitle = caseDoc.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `rifim/${sanitizedTitle}/sheet-images/${fileName}`;

    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: filePath,
      Body: file.data,
      ACL: 'public-read',
      ContentType: file.mimetype
    };

    const result = await s3.upload(params).promise();
    const fileUrl = `${process.env.SPACES_URL}/${filePath}`;

    console.log('Image uploadée:', fileUrl);
    res.json({ location: fileUrl });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload de l\'image' });
  }
});

module.exports = router;