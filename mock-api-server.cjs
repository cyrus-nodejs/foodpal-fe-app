const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Mock data
const mockUsers = [
  { id: '1', email: 'user@jollofai.com', fullName: 'John Doe', role: 'user' },
  { id: '2', email: 'admin@jollofai.com', fullName: 'Admin User', role: 'admin' }
];

const mockRecipes = [
  {
    id: '1',
    title: 'Traditional Jollof Rice',
    description: 'Authentic Nigerian Jollof Rice with rich tomato flavor',
    cuisine: 'Nigerian',
    difficulty: 'Medium',
    prepTime: 30,
    cookTime: 45,
    servings: 6,
    ingredients: [
      '3 cups of rice',
      '4 tomatoes',
      '2 bell peppers',
      '1 onion',
      'Chicken stock',
      'Spices'
    ],
    instructions: [
      'Wash and parboil rice',
      'Blend tomatoes and peppers',
      'Fry the tomato base',
      'Add rice and stock',
      'Simmer until cooked'
    ],
    image: '/images/jollof-rice.jpg',
    rating: 4.8,
    author: { name: 'Chef Amina', id: '1' },
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Egusi Soup',
    description: 'Delicious Nigerian soup made with ground melon seeds',
    cuisine: 'Nigerian',
    difficulty: 'Hard',
    prepTime: 20,
    cookTime: 60,
    servings: 4,
    ingredients: [
      '2 cups ground egusi',
      '500g assorted meat',
      '200g stockfish',
      '2 cups spinach',
      'Palm oil',
      'Seasoning'
    ],
    instructions: [
      'Cook meat and stockfish',
      'Heat palm oil',
      'Add egusi paste',
      'Add vegetables',
      'Simmer until ready'
    ],
    image: '/images/egusi-soup.jpg',
    rating: 4.6,
    author: { name: 'Chef Kemi', id: '2' },
    createdAt: '2024-01-16T14:30:00Z'
  },
  {
    id: '3',
    title: 'Suya Spiced Beef',
    description: 'Grilled beef with traditional Nigerian suya spice blend',
    cuisine: 'Nigerian',
    difficulty: 'Easy',
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    ingredients: [
      '1kg beef',
      'Suya spice',
      'Groundnuts',
      'Ginger',
      'Garlic',
      'Onions'
    ],
    instructions: [
      'Cut beef into strips',
      'Marinate with spices',
      'Thread onto skewers',
      'Grill over fire',
      'Serve hot'
    ],
    image: '/images/suya.jpg',
    rating: 4.9,
    author: { name: 'Chef Musa', id: '3' },
    createdAt: '2024-01-17T18:00:00Z'
  }
];

const mockIngredients = [
  { id: '1', name: 'Rice', category: 'Grains', description: 'Long grain rice, perfect for Jollof' },
  { id: '2', name: 'Tomatoes', category: 'Vegetables', description: 'Fresh red tomatoes' },
  { id: '3', name: 'Bell Peppers', category: 'Vegetables', description: 'Red bell peppers' },
  { id: '4', name: 'Egusi Seeds', category: 'Seeds', description: 'Ground melon seeds for soup' },
  { id: '5', name: 'Palm Oil', category: 'Oils', description: 'Traditional Nigerian palm oil' }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'JollofAI Mock API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { email, password, fullName } = req.body;
  
  if (!email || !password || !fullName) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      message: 'Email, password, and full name are required' 
    });
  }
  
  const newUser = {
    id: Date.now().toString(),
    email,
    fullName,
    role: 'user'
  };
  
  res.json({
    user: newUser,
    token: 'mock_jwt_token_' + Date.now(),
    message: 'Registration successful'
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Missing credentials',
      message: 'Email and password are required' 
    });
  }
  
  // Mock login - find user by email or create based on email pattern
  let user = mockUsers.find(u => u.email === email);
  
  if (!user) {
    // Create user based on email pattern
    const isAdmin = email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@jollofai.com';
    user = {
      id: isAdmin ? 'admin_' + Date.now() : 'user_' + Date.now(),
      email: email,
      fullName: isAdmin ? 'Admin User' : 'Demo User',
      role: isAdmin ? 'admin' : 'user'
    };
  }
  
  res.json({
    user,
    token: 'mock_jwt_token_' + Date.now(),
    message: 'Login successful'
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Recipe endpoints
app.get('/api/recipes', (req, res) => {
  const { search, cuisine, difficulty, searchMethod, page = 1, limit = 10 } = req.query;
  let filteredRecipes = [...mockRecipes];
  
  if (search) {
    console.log(`Recipe search via ${searchMethod || 'text'}: "${search}"`);
    
    if (searchMethod === 'voice') {
      // More lenient matching for voice input
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(search.toLowerCase()) ||
        recipe.description.toLowerCase().includes(search.toLowerCase()) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      // Standard text search
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(search.toLowerCase()) ||
        recipe.description.toLowerCase().includes(search.toLowerCase())
      );
    }
  }
  
  if (cuisine) {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.cuisine === cuisine);
  }
  
  if (difficulty) {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.difficulty === difficulty);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);
  
  res.json({
    recipes: paginatedRecipes,
    total: filteredRecipes.length,
    page: parseInt(page),
    totalPages: Math.ceil(filteredRecipes.length / limit)
  });
});

app.get('/api/recipes/:id', (req, res) => {
  const recipe = mockRecipes.find(r => r.id === req.params.id);
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  res.json({ recipe });
});

app.post('/api/recipes', (req, res) => {
  const newRecipe = {
    id: Date.now().toString(),
    ...req.body,
    author: { name: 'Current User', id: '1' },
    rating: 0,
    createdAt: new Date().toISOString()
  };
  
  mockRecipes.push(newRecipe);
  res.status(201).json({ recipe: newRecipe, message: 'Recipe created successfully' });
});

// Ingredient endpoints
app.get('/api/ingredients', (req, res) => {
  const { search, category } = req.query;
  let filteredIngredients = [...mockIngredients];
  
  if (search) {
    filteredIngredients = filteredIngredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (category) {
    filteredIngredients = filteredIngredients.filter(ingredient => ingredient.category === category);
  }
  
  res.json({ ingredients: filteredIngredients });
});

// User endpoints
app.get('/api/users/profile', (req, res) => {
  res.json({ user: mockUsers[0] });
});

app.put('/api/users/profile', (req, res) => {
  const updatedUser = { ...mockUsers[0], ...req.body };
  res.json({ user: updatedUser, message: 'Profile updated successfully' });
});

// Pantry endpoints
let mockPantryItems = [
  {
    id: '1',
    name: 'Jasmine Rice',
    quantity: 3,
    unit: 'kg',
    category: 'grains',
    addedDate: new Date().toISOString(),
    lowStockThreshold: 1,
    imageUrl: '/ingredients/jasmine-rice.jpg'
  },
  {
    id: '2', 
    name: 'Roma Tomatoes',
    quantity: 8,
    unit: 'pieces',
    category: 'vegetables',
    addedDate: new Date().toISOString(),
    lowStockThreshold: 5,
    imageUrl: '/ingredients/tomatoes.jpg'
  }
];

app.get('/api/pantry/items', (req, res) => {
  res.json(mockPantryItems);
});

app.post('/api/pantry/items', (req, res) => {
  const newItem = {
    id: Date.now().toString(),
    ...req.body,
    addedDate: new Date().toISOString(),
    imageUrl: req.body.image ? `/pantry-uploads/${Date.now()}-${req.body.name}.jpg` : undefined
  };
  
  mockPantryItems.push(newItem);
  res.json(newItem);
});

app.delete('/api/pantry/items/:id', (req, res) => {
  const { id } = req.params;
  mockPantryItems = mockPantryItems.filter(item => item.id !== id);
  res.json({ message: 'Item deleted successfully' });
});

// Vendors endpoints
app.get('/api/vendors', (req, res) => {
  const mockVendors = [
    {
      id: '1',
      name: 'Lagos Fresh Market',
      description: 'Fresh ingredients and spices',
      location: { lat: 6.5244, lng: 3.3792, address: 'Victoria Island, Lagos' },
      rating: 4.5,
      products: ['Rice', 'Tomatoes', 'Spices']
    },
    {
      id: '2', 
      name: 'Abuja Organic Farm',
      description: 'Organic vegetables and grains',
      location: { lat: 9.0579, lng: 7.4951, address: 'Garki, Abuja' },
      rating: 4.7,
      products: ['Vegetables', 'Grains', 'Herbs']
    }
  ];
  
  res.json({ vendors: mockVendors });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🍛 JollofAI Mock API Server running on http://localhost:${PORT}`);
  console.log(`📚 API endpoints available:`);
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/auth/login`);
  console.log(`   POST /api/auth/register`);
  console.log(`   GET  /api/recipes`);
  console.log(`   GET  /api/ingredients`);
  console.log(`   GET  /api/pantry/items`);
  console.log(`   POST /api/pantry/items`);
  console.log(`   DELETE /api/pantry/items/:id`);
  console.log(`   GET  /api/vendors`);
  console.log(`   GET  /api/users/profile`);
});

module.exports = app;