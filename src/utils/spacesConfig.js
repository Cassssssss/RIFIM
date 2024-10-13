const AWS = require('aws-sdk');

// Activer le débogage AWS
AWS.config.logger = console; // Ajoute cette ligne pour activer le logger sur la console

const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET,
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
});

// Dans spacesConfig.js
console.log('DO_SPACES_ENDPOINT:', process.env.DO_SPACES_ENDPOINT);
console.log('DO_SPACES_BUCKET:', process.env.DO_SPACES_BUCKET);
// NE PAS logger DO_SPACES_KEY ou DO_SPACES_SECRET

module.exports = s3;