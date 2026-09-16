const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Connexion à MongoDB sans les options dépréciées
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connecté à MongoDB Atlas');
    } catch (error) {
        console.error('Connexion MongoDB indisponible. Nouvelle tentative dans 5 secondes.');
        // Une coupure au démarrage ne doit pas bloquer toutes les connexions
        // jusqu'au prochain redémarrage manuel du serveur.
        setTimeout(connectDB, 5000);
    }
};

module.exports = connectDB;
