import React, { useState } from "react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  category: string;
  tags: string[];
  publishDate: string;
  readTime: number;
  image: string;
  featured: boolean;
}

interface BlogCategory {
  id: string;
  name: string;
  count: number;
  color: string;
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: BlogCategory[] = [
    {
      id: "recipes",
      name: "Recipes",
      count: 45,
      color: "bg-green-100 text-green-800",
    },
    {
      id: "nutrition",
      name: "Nutrition",
      count: 23,
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "culture",
      name: "Culture",
      count: 34,
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: "tips",
      name: "Cooking Tips",
      count: 28,
      color: "bg-orange-100 text-orange-800",
    },
    {
      id: "ingredients",
      name: "Ingredients",
      count: 19,
      color: "bg-red-100 text-red-800",
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      count: 15,
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Complete Guide to Making Perfect Jollof Rice",
      excerpt:
        "Master the art of cooking Nigeria's most beloved dish with our comprehensive guide covering ingredients, techniques, and regional variations.",
      content:
        "Jollof rice is more than just a dish—it's a cultural phenomenon that brings families and communities together...",
      author: "Chef Amina Yusuf",
      authorAvatar: "/khalid-yekini.jpg",
      category: "recipes",
      tags: ["jollof", "nigerian", "rice", "traditional"],
      publishDate: "2024-03-15",
      readTime: 8,
      image: "/images/nigeria ofada rice with ayamase.png",
      featured: true,
    },
    {
      id: 2,
      title: "Health Benefits of Traditional African Spices",
      excerpt:
        "Discover the nutritional powerhouses hiding in your spice rack. From turmeric to ginger, learn how African spices boost your health.",
      content:
        "African cuisine is renowned for its bold flavors and aromatic spices, but did you know these ingredients are also nutritional powerhouses?",
      author: "Dr. Fatima Ibrahim",
      authorAvatar: "/lucy-chioma.jpg",
      category: "nutrition",
      tags: ["health", "spices", "nutrition", "wellness"],
      publishDate: "2024-03-12",
      readTime: 6,
      image: "/images/nigeria efo riro.png",
      featured: true,
    },
    {
      id: 3,
      title: "The History and Cultural Significance of Egusi Soup",
      excerpt:
        "Explore the rich history of one of West Africa's most cherished dishes and its role in bringing communities together.",
      content:
        "Egusi soup tells a story that spans generations, connecting us to our ancestors and cultural heritage...",
      author: "Prof. Kwame Asante",
      authorAvatar: "/martins-babatunde.jpg",
      category: "culture",
      tags: ["egusi", "history", "culture", "west-africa"],
      publishDate: "2024-03-10",
      readTime: 10,
      image: "/images/fufu and egusi soup.png",
      featured: false,
    },
    {
      id: 4,
      title: "5 Essential Knife Skills Every African Cook Should Master",
      excerpt:
        "Improve your cooking efficiency and safety with these fundamental knife techniques used in African cuisine preparation.",
      content:
        "Proper knife skills are the foundation of great cooking. These techniques will transform your kitchen experience...",
      author: "Chef Blessing Okoro",
      authorAvatar: "/oluchi-joy.jpg",
      category: "tips",
      tags: ["skills", "knives", "cooking", "techniques"],
      publishDate: "2024-03-08",
      readTime: 5,
      image: "/images/nigeria suya.png",
      featured: false,
    },
    {
      id: 5,
      title: "Sourcing Authentic African Ingredients: A Global Guide",
      excerpt:
        "Find the best places to buy authentic African ingredients whether you're in Lagos, London, or Los Angeles.",
      content:
        "Living away from home doesn't mean compromising on authentic flavors. Here's your guide to finding quality African ingredients worldwide...",
      author: "Sarah Adebayo",
      authorAvatar: "/jiddah-abidemi.jpg",
      category: "ingredients",
      tags: ["shopping", "ingredients", "global", "authentic"],
      publishDate: "2024-03-05",
      readTime: 7,
      image: "/images/ghana kelewele.png",
      featured: false,
    },
    {
      id: 6,
      title: "Balancing Traditional Cooking with Modern Life",
      excerpt:
        "Practical tips for incorporating traditional African cooking methods into your busy modern lifestyle.",
      content:
        "In our fast-paced world, maintaining connections to our culinary traditions can be challenging but deeply rewarding...",
      author: "Mama Chioma",
      authorAvatar: "/khalid-yekini.jpg",
      category: "lifestyle",
      tags: ["modern", "traditional", "balance", "lifestyle"],
      publishDate: "2024-03-02",
      readTime: 6,
      image: "/images/bitterleaf soup.png",
      featured: false,
    },
  ];

  const featuredPosts = blogPosts.filter((post) => post.featured);
  const filteredPosts = blogPosts.filter((post) => {
    const categoryMatch =
      selectedCategory === "all" || post.category === selectedCategory;
    const searchMatch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            JollofAI Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover stories, recipes, and insights from the world of African
            cuisine. Learn from chefs, nutritionists, and food enthusiasts who
            share our passion for authentic flavors.
          </p>
        </div>

        {/* Featured Posts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Featured Articles
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/rice-image.jpg";
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        categories.find((c) => c.id === post.category)?.color
                      }`}
                    >
                      {categories.find((c) => c.id === post.category)?.name}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/khalid-yekini.jpg";
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {post.author}
                        </p>
                        <p className="text-xs text-gray-500">
                          {post.publishDate} • {post.readTime} min read
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/blog/${post.id}`}
                      className="text-primary font-medium hover:text-primary/80 transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Search Articles</h3>
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === "all"
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between">
                    <span>All Posts</span>
                    <span className="text-sm opacity-70">
                      {blogPosts.length}
                    </span>
                  </div>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between">
                      <span>{category.name}</span>
                      <span className="text-sm opacity-70">
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "jollof",
                  "nigerian",
                  "traditional",
                  "health",
                  "spices",
                  "culture",
                  "techniques",
                  "ingredients",
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1 bg-gray-100 hover:bg-primary hover:text-white text-gray-700 text-sm rounded-full transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-primary to-orange-600 rounded-lg shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-sm opacity-90 mb-4">
                Get the latest recipes and cooking tips delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="w-full bg-white text-primary font-medium py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === "all"
                  ? "All Articles"
                  : categories.find((c) => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-gray-600">
                {filteredPosts.length} articles found
              </p>
            </div>

            <div className="grid gap-6">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3 aspect-video md:aspect-square bg-gray-200 relative overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/rice-image.jpg";
                        }}
                      />
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            categories.find((c) => c.id === post.category)
                              ?.color
                          }`}
                        >
                          {categories.find((c) => c.id === post.category)?.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {post.readTime} min read
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary cursor-pointer">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.authorAvatar}
                            alt={post.author}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/khalid-yekini.jpg";
                            }}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {post.author}
                            </p>
                            <p className="text-xs text-gray-500">
                              {post.publishDate}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/blog/${post.id}`}
                          className="text-primary font-medium hover:text-primary/80 transition-colors"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Load More Articles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
