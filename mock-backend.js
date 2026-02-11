// Mock Backend Server for Testing JollofAI Frontend
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'JollofAI Mock Backend is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Authentication endpoints
app.post('/api/auth/register', (req, res) => {
  res.json({ 
    success: true, 
    message: 'User registered successfully (MOCK)',
    user: { id: '123', email: req.body.email, fullName: req.body.fullName }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.json({ 
      success: true, 
      token: 'mock-jwt-token',
      user: { id: '123', email, fullName: 'Test User' }
    });
  } else {
    res.status(400).json({ error: 'Email and password required' });
  }
});

// Recipes endpoints
app.get('/api/recipes', (req, res) => {
  res.json({
    success: true,
    recipes: [
      {
        id: '1',
        title: 'Jollof Rice',
        description: 'Classic Nigerian Jollof Rice with spices',
        cookTime: 45,
        servings: 4,
        difficulty: 'Medium',
        image: '/images/jollof-rice.jpg'
      },
      {
        id: '2', 
        title: 'Egusi Soup',
        description: 'Traditional Nigerian soup with melon seeds',
        cookTime: 60,
        servings: 6,
        difficulty: 'Hard',
        image: '/images/egusi-soup.jpg'
      }
    ]
  });
});

app.post('/api/recipes', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Recipe created successfully (MOCK)',
    recipe: { id: Date.now().toString(), ...req.body }
  });
});

// Users endpoints
app.get('/api/users/profile', (req, res) => {
  res.json({
    success: true,
    user: { id: '123', email: 'test@example.com', fullName: 'Test User' }
  });
});

// Vendors endpoints
app.get('/api/vendors', (req, res) => {
  res.json({
    success: true,
    vendors: [
      {
        id: '1',
        name: 'Lagos Spice Market',
        location: 'Lagos, Nigeria',
        products: ['Rice', 'Spices', 'Palm Oil'],
        rating: 4.5
      }
    ]
  });
});

// Catch all other routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/login',
      'POST /api/auth/register', 
      'GET /api/recipes',
      'POST /api/recipes',
      'GET /api/users/profile',
      'GET /api/vendors'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 JollofAI Mock Backend running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;