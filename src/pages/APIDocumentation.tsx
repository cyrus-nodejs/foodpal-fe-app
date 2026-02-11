import React, { useState } from "react";
import Button from "../components/Button";

interface APIEndpoint {
  id: string;
  method: string;
  path: string;
  title: string;
  description: string;
  parameters: Parameter[];
  requestBody?: object;
  responses: Response[];
  codeExamples: CodeExample[];
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example: string;
}

interface Response {
  status: number;
  description: string;
  example: object;
}

interface CodeExample {
  language: string;
  code: string;
}

export default function APIDocumentation() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("generate-recipe");
  const [activeTab, setActiveTab] = useState("overview");
  const [tryItValues, setTryItValues] = useState<Record<string, string>>({});

  const endpoints: APIEndpoint[] = [
    {
      id: "generate-recipe",
      method: "POST",
      path: "/api/v1/recipes/generate",
      title: "Generate Recipe",
      description:
        "Generate a personalized African recipe based on available ingredients and preferences.",
      parameters: [
        {
          name: "ingredients",
          type: "array",
          required: true,
          description: "List of available ingredients",
          example: '["rice", "tomatoes", "chicken", "onions"]',
        },
        {
          name: "cuisine",
          type: "string",
          required: false,
          description: "Preferred cuisine type",
          example: "nigerian",
        },
        {
          name: "servings",
          type: "integer",
          required: false,
          description: "Number of servings (default: 4)",
          example: "4",
        },
        {
          name: "dietary_restrictions",
          type: "array",
          required: false,
          description: "Dietary restrictions",
          example: '["vegetarian", "gluten-free"]',
        },
      ],
      requestBody: {
        ingredients: ["rice", "tomatoes", "chicken", "onions"],
        cuisine: "nigerian",
        servings: 4,
        dietary_restrictions: [],
      },
      responses: [
        {
          status: 200,
          description: "Recipe generated successfully",
          example: {
            id: "recipe_123",
            name: "Nigerian Jollof Rice",
            description: "A delicious one-pot rice dish",
            ingredients: [
              { name: "Rice", amount: "2 cups", notes: "Long grain preferred" },
              { name: "Tomatoes", amount: "4 large", notes: "Fresh or canned" },
            ],
            instructions: [
              "Wash and parboil the rice",
              "Blend tomatoes and cook sauce",
              "Combine rice with sauce and simmer",
            ],
            prep_time: 20,
            cook_time: 45,
            total_time: 65,
            difficulty: "medium",
            nutrition: {
              calories: 380,
              protein: "25g",
              carbs: "45g",
              fat: "12g",
            },
          },
        },
        {
          status: 400,
          description: "Invalid request parameters",
          example: {
            error: "validation_error",
            message: "Ingredients array cannot be empty",
            details: {
              field: "ingredients",
              code: "required",
            },
          },
        },
      ],
      codeExamples: [
        {
          language: "javascript",
          code: `// Using fetch API
const response = await fetch('https://api.jollofai.com/v1/recipes/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    ingredients: ['rice', 'tomatoes', 'chicken', 'onions'],
    cuisine: 'nigerian',
    servings: 4
  })
});

const recipe = await response.json();
console.log(recipe);`,
        },
        {
          language: "python",
          code: `import requests

url = "https://api.jollofai.com/v1/recipes/generate"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
data = {
    "ingredients": ["rice", "tomatoes", "chicken", "onions"],
    "cuisine": "nigerian",
    "servings": 4
}

response = requests.post(url, json=data, headers=headers)
recipe = response.json()
print(recipe)`,
        },
        {
          language: "curl",
          code: `curl -X POST https://api.jollofai.com/v1/recipes/generate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "ingredients": ["rice", "tomatoes", "chicken", "onions"],
    "cuisine": "nigerian",
    "servings": 4
  }'`,
        },
      ],
    },
    {
      id: "search-recipes",
      method: "GET",
      path: "/api/v1/recipes/search",
      title: "Search Recipes",
      description: "Search for recipes by name, ingredients, or cuisine type.",
      parameters: [
        {
          name: "q",
          type: "string",
          required: false,
          description: "Search query",
          example: "jollof rice",
        },
        {
          name: "cuisine",
          type: "string",
          required: false,
          description: "Filter by cuisine",
          example: "nigerian",
        },
        {
          name: "ingredients",
          type: "string",
          required: false,
          description: "Filter by ingredients (comma-separated)",
          example: "rice,tomatoes",
        },
        {
          name: "limit",
          type: "integer",
          required: false,
          description: "Number of results (default: 20, max: 100)",
          example: "10",
        },
        {
          name: "offset",
          type: "integer",
          required: false,
          description: "Pagination offset (default: 0)",
          example: "0",
        },
      ],
      responses: [
        {
          status: 200,
          description: "Search results returned successfully",
          example: {
            results: [
              {
                id: "recipe_123",
                name: "Nigerian Jollof Rice",
                description: "A delicious one-pot rice dish",
                image_url: "https://api.jollofai.com/images/recipe_123.jpg",
                cuisine: "nigerian",
                prep_time: 20,
                cook_time: 45,
                difficulty: "medium",
                rating: 4.8,
              },
            ],
            total: 156,
            limit: 10,
            offset: 0,
          },
        },
      ],
      codeExamples: [
        {
          language: "javascript",
          code: `// Search for jollof rice recipes
const response = await fetch('https://api.jollofai.com/v1/recipes/search?q=jollof+rice&limit=10', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const searchResults = await response.json();
console.log(searchResults);`,
        },
      ],
    },
    {
      id: "get-ingredients",
      method: "GET",
      path: "/api/v1/ingredients",
      title: "Get Ingredients",
      description:
        "Retrieve information about African ingredients, including nutritional data and substitutes.",
      parameters: [
        {
          name: "category",
          type: "string",
          required: false,
          description: "Filter by ingredient category",
          example: "spices",
        },
        {
          name: "search",
          type: "string",
          required: false,
          description: "Search ingredient names",
          example: "scotch",
        },
      ],
      responses: [
        {
          status: 200,
          description: "Ingredients retrieved successfully",
          example: {
            ingredients: [
              {
                id: "ing_001",
                name: "Scotch Bonnet Pepper",
                category: "spices",
                description: "Hot chili pepper common in West African cuisine",
                nutrition: {
                  calories_per_100g: 40,
                  vitamin_c: "143.7mg",
                  capsaicin: "high",
                },
                substitutes: ["Habanero pepper", "Thai chili"],
                storage_tips: "Store in refrigerator for up to 2 weeks",
              },
            ],
          },
        },
      ],
      codeExamples: [
        {
          language: "javascript",
          code: `// Get spice ingredients
const response = await fetch('https://api.jollofai.com/v1/ingredients?category=spices', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const ingredients = await response.json();
console.log(ingredients);`,
        },
      ],
    },
  ];

  const selectedEndpointData = endpoints.find(
    (ep) => ep.id === selectedEndpoint
  );

  const handleTryIt = async () => {
    // Simulate API call
    console.log("Trying API with values:", tryItValues);
    // In a real implementation, this would make an actual API call
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            JollofAI API Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Integrate JollofAI's recipe generation and ingredient intelligence
            into your applications. Build amazing African cuisine experiences
            with our powerful API.
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-gradient-to-r from-primary to-orange-600 rounded-xl p-8 text-white mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
              <p className="mb-4 opacity-90">
                Get started with JollofAI API in minutes. Generate your API key
                and start building.
              </p>
              <div className="flex gap-4">
                <Button className="bg-white text-primary hover:bg-gray-100">
                  Get API Key
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  View Examples
                </Button>
              </div>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <pre className="text-sm">
                {`curl -X POST https://api.jollofai.com/v1/recipes/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"ingredients": ["rice", "tomatoes"]}'`}
              </pre>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Endpoints</h3>
              <nav className="space-y-2">
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => setSelectedEndpoint(endpoint.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedEndpoint === endpoint.id
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-mono rounded ${
                          endpoint.method === "GET"
                            ? "bg-green-100 text-green-800"
                            : endpoint.method === "POST"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                    </div>
                    <div className="text-sm mt-1">{endpoint.title}</div>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold mb-3">Resources</h4>
                <div className="space-y-2 text-sm">
                  <a
                    href="#authentication"
                    className="block text-gray-600 hover:text-primary"
                  >
                    Authentication
                  </a>
                  <a
                    href="#rate-limits"
                    className="block text-gray-600 hover:text-primary"
                  >
                    Rate Limits
                  </a>
                  <a
                    href="#errors"
                    className="block text-gray-600 hover:text-primary"
                  >
                    Error Codes
                  </a>
                  <a
                    href="#sdks"
                    className="block text-gray-600 hover:text-primary"
                  >
                    SDKs
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedEndpointData && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Endpoint Header */}
                <div className="border-b border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-3 py-1 text-sm font-mono rounded ${
                        selectedEndpointData.method === "GET"
                          ? "bg-green-100 text-green-800"
                          : selectedEndpointData.method === "POST"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedEndpointData.method}
                    </span>
                    <code className="text-lg font-mono bg-gray-100 px-3 py-1 rounded">
                      {selectedEndpointData.path}
                    </code>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedEndpointData.title}
                  </h2>
                  <p className="text-gray-600">
                    {selectedEndpointData.description}
                  </p>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex px-6">
                    {["overview", "try-it", "code-examples"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      {/* Parameters */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Parameters
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                                  Name
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                                  Type
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                                  Required
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                                  Description
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {selectedEndpointData.parameters.map((param) => (
                                <tr key={param.name}>
                                  <td className="px-4 py-3 text-sm font-mono text-primary">
                                    {param.name}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    {param.type}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs ${
                                        param.required
                                          ? "bg-red-100 text-red-800"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      {param.required ? "Required" : "Optional"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    {param.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Request Body */}
                      {selectedEndpointData.requestBody && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Request Body Example
                          </h3>
                          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                            {JSON.stringify(
                              selectedEndpointData.requestBody,
                              null,
                              2
                            )}
                          </pre>
                        </div>
                      )}

                      {/* Responses */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Responses
                        </h3>
                        <div className="space-y-4">
                          {selectedEndpointData.responses.map((response) => (
                            <div
                              key={response.status}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className={`px-2 py-1 text-sm font-mono rounded ${
                                    response.status < 300
                                      ? "bg-green-100 text-green-800"
                                      : response.status < 500
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {response.status}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {response.description}
                                </span>
                              </div>
                              <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                                {JSON.stringify(response.example, null, 2)}
                              </pre>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "try-it" && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">
                        Try This Endpoint
                      </h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Note:</strong> This is a demo interface. In
                          production, you'll need a valid API key.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {selectedEndpointData.parameters.map((param) => (
                          <div key={param.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {param.name}
                              {param.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                              <span className="text-gray-500 ml-2">
                                ({param.type})
                              </span>
                            </label>
                            <input
                              type="text"
                              placeholder={param.example}
                              value={tryItValues[param.name] || ""}
                              onChange={(e) =>
                                setTryItValues({
                                  ...tryItValues,
                                  [param.name]: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <p className="text-sm text-gray-600 mt-1">
                              {param.description}
                            </p>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={handleTryIt}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        Send Request
                      </Button>
                    </div>
                  )}

                  {activeTab === "code-examples" && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Code Examples</h3>
                      {selectedEndpointData.codeExamples.map((example) => (
                        <div key={example.language}>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium capitalize">
                              {example.language}
                            </h4>
                            <button className="text-sm text-primary hover:text-primary/80">
                              Copy Code
                            </button>
                          </div>
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                            {example.code}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
