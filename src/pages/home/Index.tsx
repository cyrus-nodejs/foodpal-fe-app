import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/Button";
import heroImage from "../../images/image.png";
import {  useAppSelector } from "../../redux/app/hook";


export default function Home() {
  const navigate = useNavigate();
     const {   user } = useAppSelector((state) => state.auth)
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50/80 via-white to-primary/5 overflow-hidden pt-8 pb-16 flex items-center">
        {/* Simplified Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary/4 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto max-w-6xl px-6 py-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Clean Badge */}
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                  🍛 AI-Powered African Cuisine
                </span>
              </div>

              {/* Simplified Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Authentic African recipes
                  <span className="block text-primary mt-2">
                    designed for you
                  </span>
                </h1>
              </div>

              {/* Clean Description */}
              <div className="space-y-4">
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                  Transform your ingredients into delicious African meals with
                  our intelligent recipe generator. Discover traditional flavors
                  made simple.
                </p>
              </div>

              {/* Clean Action Buttons */}
              { !user && ( <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/recipe-generator">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/signin">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg font-medium border-2 border-gray-300 hover:border-primary hover:text-primary rounded-xl transition-all duration-200 w-full sm:w-auto"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>)}
             

              {/* Simplified Trust Indicators */}
              <div className="pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      10,000+
                    </div>
                    <div className="text-sm text-gray-600">
                      Recipes Generated
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">500+</div>
                    <div className="text-sm text-gray-600">
                      African Ingredients
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">50+</div>
                    <div className="text-sm text-gray-600">
                      Countries Served
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Clean Hero Image */}
            <div className="relative w-full flex justify-center">
              {/* Clean Image Container */}
              <div className="relative w-full max-w-2xl">
                {/* Simple Background Card */}
                <div className="absolute inset-0 bg-white rounded-2xl shadow-lg transform rotate-1"></div>

                {/* Main Image Card */}
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Hero Image */}
                  <div className="p-3">
                    <img
                      src={heroImage}
                      alt="JollofAI - Traditional African cuisine made simple"
                      className="w-full h-64 md:h-80 object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-max px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose JollofAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of tradition and technology in your
              kitchen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI-Powered
              </h3>
              <p className="text-gray-600">
                Advanced machine learning analyzes your ingredients and
                preferences to create perfect recipes
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Authentic
              </h3>
              <p className="text-gray-600">
                Preserve traditional African cooking methods while adapting to
                modern kitchens
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Instant
              </h3>
              <p className="text-gray-600">
                Get personalized recipes in seconds, complete with nutritional
                information and cooking tips
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-max px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured African Recipes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover authentic flavors from across Africa, crafted by AI and
              perfected by tradition
            </p>
          </div>
             {!user ? (<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
            {/* Recipe Card 1 */}
           
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/recipes/picai29.jpeg"
                  alt="Traditional Jollof Rice"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                    ⭐ 4.8
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Classic Jollof Rice
                </h3>
                <p className="text-gray-600 mb-4">
                  The crown jewel of West African cuisine, perfectly spiced and
                  aromatic
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>🕐 45 mins</span>
                  <span>👥 4 servings</span>
                  <span>🔥 Medium</span>
                </div>
              </div>
            </div>

            {/* Recipe Card 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/images/nigeria akara.png"
                  alt="Nigerian Akara"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                    ⭐ 4.7
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nigerian Akara
                </h3>
                <p className="text-gray-600 mb-4">
                  Traditional West African bean fritters made from ground
                  black-eyed peas, seasoned with onions and peppers, then
                  deep-fried to golden perfection - a beloved breakfast staple
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>🕐 30 mins</span>
                  <span>👥 4 servings</span>
                  <span>🔥 Easy</span>
                </div>
              </div>
            </div>

            {/* Recipe Card 3 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/images/ghana kelewele.png"
                  alt="Ghanaian Kelewele"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                    ⭐ 4.7
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Spiced Plantain (Kelewele)
                </h3>
                <p className="text-gray-600 mb-4">
                  Crispy fried plantain cubes with aromatic Ghanaian spices
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>🕐 25 mins</span>
                  <span>👥 4 servings</span>
                  <span>🔥 Easy</span>
                </div>
              </div>
            </div>

            {/* Recipe Card 4 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/recipes/picai25.jpeg"
                  alt="Nigerian Plantain (Dodo)"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                    ⭐ 4.6
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nigerian Plantain (Dodo)
                </h3>
                <p className="text-gray-600 mb-4">
                  Sweet, caramelized fried plantain slices - Nigeria's beloved
                  side dish
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>🕐 15 mins</span>
                  <span>👥 4 servings</span>
                  <span>🔥 Easy</span>
                </div>
              </div>
            </div>

            {/* Recipe Card 5 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/recipes/picai30.jpeg"
                  alt="Preserving African Culture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                    ⭐ 4.8
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Preserving African Culture
                </h3>
                <p className="text-gray-600 mb-4">
                  Traditional cooking methods and ancestral recipes passed down
                  through generations
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>🕐 2hrs</span>
                  <span>👥 6 servings</span>
                  <span>🔥 Medium</span>
                </div>
              </div>
            </div>

            {/* Recipe Card 6 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/recipes/picai35.jpeg"
                  alt="African Natural Spices"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                    ⭐ 4.5
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  African Natural Spices
                </h3>
                <p className="text-gray-600 mb-4">
                  Rich meat casserole infused with African natural spices and
                  aromatic herbs
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>🕐 1hr 15mins</span>
                  <span>👥 6 servings</span>
                  <span>🔥 Medium</span>
                </div>
              </div>
            </div>
          </div>) : (<div></div>) }
          

          {/* View More Button */}
          <div className="text-center mt-12">
            <Button
              onClick={() => navigate("/recipe-discovery")}
              variant="outline"
              size="lg"
              className="border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white"
            >
              Discover More Recipes
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container-max px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Amazing Recipes?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of home cooks who are discovering new flavors with
            JollofAI
          </p>
          <Link to="/recipe-generator">
            <Button
              variant="secondary"
              size="lg"
              className="bg-orange-500 text-white hover:bg-orange-600 border-orange-500 hover:border-orange-600"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
