// Mock data for offline development
export const mockRecipes = [
  {
    id: '1',
    title: 'Traditional Jollof Rice',
    description: 'Authentic Nigerian Jollof Rice with rich tomato flavor and perfectly cooked rice',
    cuisine: 'Nigerian',
    difficulty: 'Medium',
    prepTime: 30,
    cookTime: 45,
    servings: 6,
    ingredients: [
      '3 cups of long grain rice',
      '4 large fresh tomatoes',
      '2 red bell peppers',
      '1 large onion',
      '3 cups chicken stock',
      '2 tbsp vegetable oil',
      '1 tsp curry powder',
      '1 tsp thyme',
      'Salt to taste',
      'Bay leaves'
    ],
    instructions: [
      'Wash and parboil the rice until slightly tender',
      'Blend tomatoes, bell peppers, and half the onion until smooth',
      'Heat oil in a large pot and fry the remaining chopped onion',
      'Add the blended tomato mixture and cook until oil rises to the top',
      'Add the parboiled rice and chicken stock',
      'Season with curry powder, thyme, salt, and bay leaves',
      'Cover and simmer on low heat for 20-25 minutes until rice is cooked'
    ],
    image: '/images/jollof-rice.jpg',
    rating: 4.8,
    reviews: 156,
    author: { 
      name: 'Chef Amina Adebayo', 
      id: '1',
      avatar: '/images/chef-amina.jpg'
    },
    createdAt: '2024-01-15T10:00:00Z',
    tags: ['rice', 'nigerian', 'main-dish', 'party-food']
  },
  {
    id: '2',
    title: 'Rich Egusi Soup',
    description: 'Traditional Nigerian soup made with ground melon seeds and leafy vegetables',
    cuisine: 'Nigerian',
    difficulty: 'Hard',
    prepTime: 20,
    cookTime: 60,
    servings: 4,
    ingredients: [
      '2 cups ground egusi (melon seeds)',
      '500g assorted meat (beef, goat meat)',
      '200g dried fish (stockfish)',
      '2 cups fresh spinach or ugu leaves',
      '3 tbsp palm oil',
      '1 large onion, chopped',
      '3 cloves garlic, minced',
      '1 scotch bonnet pepper',
      'Seasoning cubes',
      'Salt to taste'
    ],
    instructions: [
      'Cook assorted meat and stockfish with seasoning until tender',
      'Heat palm oil in a large pot over medium heat',
      'Add chopped onion and garlic, sauté until fragrant',
      'Add ground egusi and stir continuously for 5 minutes',
      'Gradually add meat stock, stirring to prevent lumps',
      'Add cooked meat and fish to the pot',
      'Season with salt, pepper, and seasoning cubes',
      'Add leafy vegetables and simmer for 10 minutes',
      'Adjust seasoning and serve hot with pounded yam or rice'
    ],
    image: '/images/egusi-soup.jpg',
    rating: 4.6,
    reviews: 89,
    author: { 
      name: 'Chef Kemi Ogundimu', 
      id: '2',
      avatar: '/images/chef-kemi.jpg'
    },
    createdAt: '2024-01-16T14:30:00Z',
    tags: ['soup', 'nigerian', 'egusi', 'traditional']
  },
  {
    id: '3',
    title: 'Spicy Suya Beef',
    description: 'Grilled beef skewers with traditional Nigerian suya spice blend',
    cuisine: 'Nigerian',
    difficulty: 'Easy',
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    ingredients: [
      '1kg lean beef, cut into strips',
      '3 tbsp suya spice blend',
      '1/2 cup roasted groundnuts, crushed',
      '1 tsp ginger powder',
      '2 cloves garlic, minced',
      '1 large onion, sliced',
      '2 tbsp vegetable oil',
      'Wooden skewers',
      'Salt to taste'
    ],
    instructions: [
      'Soak wooden skewers in water for 30 minutes',
      'Mix suya spice, crushed groundnuts, ginger, and garlic in a bowl',
      'Cut beef into long strips and season with salt',
      'Coat beef strips generously with the spice mixture',
      'Thread seasoned beef onto skewers alternating with onion slices',
      'Brush lightly with oil',
      'Grill over medium-high heat for 15-20 minutes, turning occasionally',
      'Serve hot with sliced tomatoes, onions, and extra suya spice'
    ],
    image: '/images/suya.jpg',
    rating: 4.9,
    reviews: 234,
    author: { 
      name: 'Chef Musa Ibrahim', 
      id: '3',
      avatar: '/images/chef-musa.jpg'
    },
    createdAt: '2024-01-17T18:00:00Z',
    tags: ['grilled', 'suya', 'beef', 'spicy', 'street-food']
  },
  {
    id: '4',
    title: 'Pepper Soup (Goat Meat)',
    description: 'Spicy Nigerian pepper soup with tender goat meat and aromatic spices',
    cuisine: 'Nigerian',
    difficulty: 'Medium',
    prepTime: 10,
    cookTime: 40,
    servings: 4,
    ingredients: [
      '1kg goat meat, cut into pieces',
      '2 tbsp pepper soup spice',
      '2 scotch bonnet peppers',
      '1 large onion, sliced',
      '3 cloves garlic',
      '1 tsp ginger, minced',
      '2 seasoning cubes',
      '1 tsp salt',
      'Scent leaves (optional)',
      'Water as needed'
    ],
    instructions: [
      'Wash goat meat thoroughly and place in a pot',
      'Add chopped onion, garlic, ginger, and seasoning cubes',
      'Add just enough water to cover the meat',
      'Cook on medium heat for 30 minutes until meat is tender',
      'Add pepper soup spice and scotch bonnet peppers',
      'Season with salt and cook for another 10 minutes',
      'Add scent leaves if using and cook for 2 more minutes',
      'Serve hot as soup or with rice'
    ],
    image: '/images/pepper-soup.jpg',
    rating: 4.7,
    reviews: 98,
    author: { 
      name: 'Chef Adunni Olatunji', 
      id: '4',
      avatar: '/images/chef-adunni.jpg'
    },
    createdAt: '2024-01-18T16:45:00Z',
    tags: ['soup', 'pepper-soup', 'goat-meat', 'spicy']
  },
  {
    id: '5',
    title: 'Nigerian Fried Rice',
    description: 'Colorful Nigerian-style fried rice with mixed vegetables and protein',
    cuisine: 'Nigerian',
    difficulty: 'Easy',
    prepTime: 25,
    cookTime: 25,
    servings: 6,
    ingredients: [
      '4 cups cooked rice (preferably day-old)',
      '200g mixed vegetables (carrots, green beans, peas)',
      '200g cooked chicken, diced',
      '100g cooked shrimp',
      '3 eggs, beaten',
      '1 large onion, diced',
      '2 cloves garlic, minced',
      '3 tbsp vegetable oil',
      '2 tbsp soy sauce',
      '1 tsp curry powder',
      'Salt and pepper to taste',
      'Spring onions for garnish'
    ],
    instructions: [
      'Heat 1 tbsp oil in a large wok or pan',
      'Scramble the beaten eggs and set aside',
      'Add remaining oil and sauté onions until translucent',
      'Add garlic and mixed vegetables, stir-fry for 3 minutes',
      'Add cooked rice, breaking up any clumps',
      'Add chicken, shrimp, and scrambled eggs',
      'Season with soy sauce, curry powder, salt, and pepper',
      'Stir-fry for 5-7 minutes until heated through',
      'Garnish with chopped spring onions and serve'
    ],
    image: '/images/fried-rice.jpg',
    rating: 4.5,
    reviews: 167,
    author: { 
      name: 'Chef Bola Fashola', 
      id: '5',
      avatar: '/images/chef-bola.jpg'
    },
    createdAt: '2024-01-19T12:20:00Z',
    tags: ['rice', 'fried-rice', 'vegetables', 'easy']
  }
];

export const mockIngredients = [
  { id: '1', name: 'Rice (Long Grain)', category: 'Grains', description: 'Perfect for Jollof rice and fried rice', image: '/images/ingredients/rice.jpg' },
  { id: '2', name: 'Fresh Tomatoes', category: 'Vegetables', description: 'Essential for Nigerian stews and soups', image: '/images/ingredients/tomatoes.jpg' },
  { id: '3', name: 'Red Bell Peppers', category: 'Vegetables', description: 'Adds sweetness and color to dishes', image: '/images/ingredients/bell-peppers.jpg' },
  { id: '4', name: 'Egusi Seeds (Ground)', category: 'Seeds & Nuts', description: 'Ground melon seeds for traditional soup', image: '/images/ingredients/egusi.jpg' },
  { id: '5', name: 'Palm Oil', category: 'Oils & Fats', description: 'Traditional Nigerian cooking oil', image: '/images/ingredients/palm-oil.jpg' },
  { id: '6', name: 'Scotch Bonnet Peppers', category: 'Spices & Peppers', description: 'Hot peppers for authentic Nigerian heat', image: '/images/ingredients/scotch-bonnet.jpg' },
  { id: '7', name: 'Suya Spice', category: 'Spices & Peppers', description: 'Blend of groundnuts and spices', image: '/images/ingredients/suya-spice.jpg' },
  { id: '8', name: 'Stockfish', category: 'Protein', description: 'Dried fish for traditional soups', image: '/images/ingredients/stockfish.jpg' },
  { id: '9', name: 'Ugu Leaves', category: 'Vegetables', description: 'Nigerian pumpkin leaves for soups', image: '/images/ingredients/ugu.jpg' },
  { id: '10', name: 'Curry Powder', category: 'Spices & Peppers', description: 'Essential spice for Nigerian cuisine', image: '/images/ingredients/curry.jpg' }
];

export const mockVendors = [
  {
    id: '1',
    name: 'Lagos Fresh Market',
    description: 'Premium African ingredients and spices',
    location: { 
      lat: 6.5244, 
      lng: 3.3792, 
      address: '123 Victoria Island, Lagos State, Nigeria',
      city: 'Lagos',
      state: 'Lagos'
    },
    rating: 4.5,
    reviewCount: 89,
    products: ['Rice', 'Tomatoes', 'Palm Oil', 'Spices', 'Fresh Vegetables'],
    image: '/images/vendors/lagos-market.jpg',
    phone: '+234-800-123-4567',
    email: 'info@lagosfresh.com',
    hours: 'Mon-Sat: 7AM-7PM, Sun: 8AM-5PM',
    verified: true
  },
  {
    id: '2', 
    name: 'Abuja Organic Farms',
    description: 'Organic vegetables and premium grains',
    location: { 
      lat: 9.0579, 
      lng: 7.4951, 
      address: '45 Garki Area 1, Abuja FCT, Nigeria',
      city: 'Abuja',
      state: 'FCT'
    },
    rating: 4.7,
    reviewCount: 156,
    products: ['Organic Vegetables', 'Grains', 'Herbs', 'Leafy Greens'],
    image: '/images/vendors/abuja-organic.jpg',
    phone: '+234-900-765-4321',
    email: 'orders@abujaorganic.com',
    hours: 'Mon-Fri: 6AM-6PM, Sat: 7AM-4PM',
    verified: true
  },
  {
    id: '3',
    name: 'Kano Spice House',
    description: 'Traditional northern Nigerian spices and seasonings',
    location: { 
      lat: 11.9956, 
      lng: 8.5208, 
      address: '78 Sabon Gari, Kano State, Nigeria',
      city: 'Kano',
      state: 'Kano'
    },
    rating: 4.8,
    reviewCount: 234,
    products: ['Suya Spice', 'Pepper Soup Spice', 'Dried Pepper', 'Ginger', 'Garlic'],
    image: '/images/vendors/kano-spice.jpg',
    phone: '+234-700-555-0123',
    email: 'spices@kanospice.ng',
    hours: 'Daily: 8AM-8PM',
    verified: true
  }
];

// Mock community posts
export const mockCommunityPosts = [
  {
    id: '1',
    title: 'Best Jollof Rice Technique - Lagos vs Accra Style',
    content: 'I\'ve been experimenting with different Jollof rice techniques and wanted to share my findings. The key difference between Lagos and Accra style is in the parboiling method...',
    author: {
      id: '1',
      fullName: 'Chef Amina Adebayo',
      email: 'amina@example.com'
    },
    category: 'techniques',
    likes: 24,
    likedBy: ['2', '3'],
    comments: [
      {
        id: 'c1',
        content: 'Great insights! I tried the Lagos method and it worked perfectly.',
        author: { id: '2', fullName: 'Kemi Johnson' },
        createdAt: '2024-01-15T14:30:00Z'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    tags: ['jollof', 'techniques', 'west-african']
  },
  {
    id: '2',
    title: 'Substituting Palm Oil in Traditional Recipes',
    content: 'For those who can\'t find palm oil easily, here are some great alternatives that maintain the authentic flavor profile...',
    author: {
      id: '2',
      fullName: 'Kemi Johnson',
      email: 'kemi@example.com'
    },
    category: 'ingredients',
    likes: 18,
    likedBy: ['1', '3'],
    comments: [],
    createdAt: '2024-01-14T15:00:00Z',
    updatedAt: '2024-01-14T15:00:00Z',
    tags: ['substitutions', 'ingredients', 'palm-oil']
  },
  {
    id: '3',
    title: 'My Family\'s Secret Egusi Recipe',
    content: 'This recipe has been in my family for generations. The secret is in how we prepare the melon seeds...',
    author: {
      id: '3',
      fullName: 'Adunni Okafor',
      email: 'adunni@example.com'
    },
    category: 'recipes',
    likes: 32,
    likedBy: ['1', '2'],
    comments: [
      {
        id: 'c2',
        content: 'This sounds amazing! Could you share the spice measurements?',
        author: { id: '1', fullName: 'Chef Amina Adebayo' },
        createdAt: '2024-01-13T16:00:00Z'
      },
      {
        id: 'c3',
        content: 'I made this yesterday and it was incredible!',
        author: { id: '4', fullName: 'Ibrahim Musa' },
        createdAt: '2024-01-13T18:30:00Z'
      }
    ],
    createdAt: '2024-01-13T12:00:00Z',
    updatedAt: '2024-01-13T12:00:00Z',
    tags: ['egusi', 'family-recipe', 'nigerian']
  }
];

// Helper function to simulate API delays
export const simulateApiDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));