const express = require('express');
const connectDB = require('./src/utils/db');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Charger les variables d'environnement appropriées
const envFile = process.env.NODE_ENV === 'production' ? '.env.production.backend' : '.env.development.backend';
dotenv.config({ path: path.resolve(__dirname, envFile) });

const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');
const questionnaireRoutes = require('./routes/questionnaireRoutes');
const protocolRoutes = require('./routes/protocolRoutes'); // ← AJOUT ICI
const sheetRoutes = require('./routes/sheetRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      'https://seal-app-2-piuqm.ondigitalocean.app',
      'https://rifim-radiologie.com',
      'https://www.rifim-radiologie.com'
    ]
  : [
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];

app.use(cors({
  origin: function (origin, callback) {
    console.log('Origine de la requête:', origin);
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origine non autorisée:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/questionnaires', questionnaireRoutes);
app.use('/api/protocols', protocolRoutes); // ← AJOUT ICI
app.use('/api/cases', sheetRoutes);
app.use('/api', imageRoutes.router);

// Debug des routes disponibles
console.log('Routes disponibles :');
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(middleware.route.path, middleware.route.methods);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log(handler.route.path, handler.route.methods);
      }
    });
  }
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Allowed origins:', allowedOrigins);
});