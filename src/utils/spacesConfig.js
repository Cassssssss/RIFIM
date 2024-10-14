const AWS = require('aws-sdk');

// Activer le débogage AWS
AWS.config.logger = console;

// Vérification des variables d'environnement requises
const requiredEnvVars = ['DO_SPACES_ENDPOINT', 'DO_SPACES_KEY', 'DO_SPACES_SECRET', 'DO_SPACES_BUCKET'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`La variable d'environnement ${varName} n'est pas définie!`);
  }
});

// Configuration du endpoint
const spacesEndpoint = new AWS.Endpoint('https://lon1.digitaloceanspaces.com');

// Configuration du client S3
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  region: 'lon1' // Assurez-vous que c'est la bonne région
});

// Logging des informations de configuration (sans les clés sensibles)
console.log('DO_SPACES_ENDPOINT:', process.env.DO_SPACES_ENDPOINT);
console.log('DO_SPACES_BUCKET:', process.env.DO_SPACES_BUCKET);

// Test de connexion
s3.listBuckets((err, data) => {
  if (err) {
    console.error("Erreur lors de la connexion à DigitalOcean Spaces:", err);
  } else {
    console.log("Connexion réussie à DigitalOcean Spaces. Buckets disponibles:", data.Buckets.map(b => b.Name));
  }
});

// Fonction utilitaire pour vérifier si un bucket existe
const checkBucketExists = (bucketName) => {
  return new Promise((resolve, reject) => {
    s3.headBucket({ Bucket: bucketName }, (err, data) => {
      if (err) {
        console.error(`Erreur lors de la vérification du bucket ${bucketName}:`, err);
        reject(err);
      } else {
        console.log(`Le bucket ${bucketName} existe et est accessible.`);
        resolve(true);
      }
    });
  });
};

// Vérifier si le bucket spécifié existe
checkBucketExists(process.env.DO_SPACES_BUCKET)
  .then(() => console.log('Configuration du bucket vérifiée avec succès.'))
  .catch(() => console.error('Échec de la vérification du bucket.'));

module.exports = s3;