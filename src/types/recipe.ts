export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

export interface Instruction {
  id: string;
  step: number;
  description: string;
}

export interface Recipe {
  _id: string;

  title: string;
  description: string;

  servings: number;
  prepTime: number;
  cookTime: number;

  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  cuisine: string;

  ingredients: Ingredient[];
  instructions: Instruction[];

  tags: string[];
  nutritionNotes: string;

  imageUrl?: string;

  costLevel: "low" | "medium" | "high";
  moodTags: string[];

  embedding?: number[];
  similarity?: number;

  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  rating?: number;
  reviews?: number;

  createdAt?: string;
  updatedAt?: string;
}


// interface Recipe {
//   id: string;
//   title: string;
//   description: string;
//   ingredients: string[];
//   instructions: string[];
//   imageUrl?: string;
//   prepTime: number;
//   cookTime: number;
//   servings: number;
//   difficulty: "Easy" | "Medium" | "Hard";
//   cuisine: string;
//   nutrition?: {
//     calories: number;
//     protein: number;
//     carbs: number;
//     fat: number;
//   };
//   rating?: number;
//   reviews?: number;
// }
