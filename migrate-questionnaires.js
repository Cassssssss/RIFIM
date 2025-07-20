const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement appropriées
const envFile = process.env.NODE_ENV === 'production' ? '.env.production.backend' : '.env.development.backend';
dotenv.config({ path: path.resolve(__dirname, envFile) });

// Modèle Questionnaire simple pour la migration
const questionnaireSchema = new mongoose.Schema({}, { strict: false });
const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);

async function migrateQuestionnaires() {
  try {
    // Connexion à MongoDB
    console.log('Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');

    // Trouver tous les questionnaires problématiques
    console.log('🔍 Recherche des questionnaires à migrer...');
    
    const problematicQuestionnaires = await Questionnaire.find({
      $or: [
        { hiddenQuestions: { $type: "string" } }, // hiddenQuestions est une string
        { hiddenQuestions: { $exists: false } }, // hiddenQuestions n'existe pas
        { hiddenQuestions: null } // hiddenQuestions est null
      ]
    });

    console.log(`📊 ${problematicQuestionnaires.length} questionnaires trouvés à migrer`);

    if (problematicQuestionnaires.length === 0) {
      console.log('✅ Aucune migration nécessaire !');
      return;
    }

    // Migrer chaque questionnaire
    let migratedCount = 0;
    let errorCount = 0;

    for (const questionnaire of problematicQuestionnaires) {
      try {
        console.log(`🔄 Migration du questionnaire: ${questionnaire._id} - "${questionnaire.title}"`);
        
        // Créer un objet de mise à jour
        const updateData = {};

        // 1. Corriger hiddenQuestions
        if (typeof questionnaire.hiddenQuestions === 'string') {
          try {
            // Essayer de parser la string JSON
            const parsed = JSON.parse(questionnaire.hiddenQuestions);
            if (Array.isArray(parsed)) {
              updateData.hiddenQuestions = parsed;
            } else if (typeof parsed === 'object' && parsed !== null) {
              updateData.hiddenQuestions = parsed;
            } else {
              updateData.hiddenQuestions = {};
            }
          } catch (parseError) {
            console.log(`⚠️  Impossible de parser hiddenQuestions pour ${questionnaire._id}, utilisation d'un objet vide`);
            updateData.hiddenQuestions = {};
          }
        } else if (!questionnaire.hiddenQuestions) {
          updateData.hiddenQuestions = {};
        }

        // 2. S'assurer que les autres champs existent avec des valeurs par défaut
        if (typeof questionnaire.averageRating !== 'number') {
          updateData.averageRating = 0;
        }
        
        if (typeof questionnaire.ratingsCount !== 'number') {
          updateData.ratingsCount = 0;
        }
        
        if (typeof questionnaire.views !== 'number') {
          updateData.views = 0;
        }
        
        if (typeof questionnaire.copies !== 'number') {
          updateData.copies = 0;
        }
        
        if (!Array.isArray(questionnaire.tags)) {
          updateData.tags = [];
        }

        // 3. S'assurer que public est un boolean
        if (typeof questionnaire.public !== 'boolean') {
          updateData.public = false;
        }

        // Appliquer la mise à jour
        await Questionnaire.updateOne(
          { _id: questionnaire._id },
          { $set: updateData },
          { runValidators: false } // Désactiver la validation pour cette migration
        );

        migratedCount++;
        console.log(`✅ Questionnaire ${questionnaire._id} migré avec succès`);

      } catch (error) {
        errorCount++;
        console.error(`❌ Erreur lors de la migration du questionnaire ${questionnaire._id}:`, error.message);
      }
    }

    console.log('\n📈 RÉSUMÉ DE LA MIGRATION:');
    console.log(`✅ Questionnaires migrés avec succès: ${migratedCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);
    console.log(`📊 Total traité: ${migratedCount + errorCount}`);

    if (migratedCount > 0) {
      console.log('\n🎉 Migration terminée ! Vos anciens questionnaires devraient maintenant fonctionner correctement.');
    }

  } catch (error) {
    console.error('❌ Erreur fatale lors de la migration:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée');
    process.exit(0);
  }
}

// Exécuter la migration
console.log('🚀 DÉBUT DE LA MIGRATION DES QUESTIONNAIRES');
console.log('=' .repeat(50));
migrateQuestionnaires();