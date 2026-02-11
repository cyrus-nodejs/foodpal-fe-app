import { useEffect } from "react";
import { useAppDispatch } from "./redux/app/hook";



import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/home/Index";

import CreateRecipe from "./pages/recipe/CreateRecipes";
import Recipe from "./pages/recipe/GenerateAiRecipe";
import RecipeDiscovery from "./pages/recipe/RecipeDiscovery";
 import RecipeDetail from "./pages/recipe/RecipeDetail";

import NearestVendor from "./pages/vendor/NearestVendorMap";
 import VendorMarketplace from "./pages/vendor/vendorMarketPlace"


import Ingredients from "./pages/Ingredients";

import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Dashboard from "./pages/home/Dashboard";

import AIChatPage from "./pages/AIChatPage";
 import Community from "./pages/Community";

import Blog from "./pages/Blog";
import APIDocumentation from "./pages/APIDocumentation";
import HelpCenter from "./pages/HelpCenter";
 import Profile from "./pages/profile/Profile";
import Pantry from "./pages/pantry/Pantry";
 import ShoppingList from "./pages/ShoppingList";
 import MealPlanning from "./pages/MealPlanning";
 import NutritionDashboard from "./pages/NutritionDashboard";
 import AdminDashboard from "./pages/AdminDashboard";

import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import CookiePolicy from "./pages/CookiePolicy";

import DiagnosticPage from "./pages/DiagnosticPage";
 import NotFound from "./pages/NotFound";

import About from "./pages/About";

import { CurrentUser } from "./redux/features/auth/authSlice";



  

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 bg-white">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const App = () => {



  const dispatch = useAppDispatch()
   
  //get Authorized User
           console.log(import.meta.env.VITE_API_BASE_URL)
  useEffect(() =>{
     console.log("Dispatching current-user");
        dispatch(CurrentUser())
       
          // eslint-disable-next-line react-hooks/exhaustive-deps
          }, [])

// Layout component to include Navbar and Footer


  const router = createBrowserRouter([
    {
      element: <Layout />, // All child routes share Navbar & Footer
      children: [
        { path: "/", element: <Home />, errorElement: <NotFound /> },

        //Recipe Routes
        { path: "/recipe-generator", element: <Recipe />, errorElement: <NotFound /> },
        { path: "/recipe-discovery", element: <RecipeDiscovery />, errorElement: <NotFound /> },
         { path: "/create-recipe", element: <ProtectedRoute><CreateRecipe /></ProtectedRoute>, errorElement: <NotFound /> },
        
        
         { path: "/recipe/:id", element: <RecipeDetail />, errorElement: <NotFound /> },
        { path: "/marketplace", element: <VendorMarketplace />, errorElement: <NotFound /> },
          { path: "/nearest-vendor", element: <NearestVendor />, errorElement: <NotFound /> },
       
       
          { path: "/ingredients", element: <Ingredients />, errorElement: <NotFound /> },
       
        { path: "/ai-chat", element: <AIChatPage />, errorElement: <NotFound /> },
        { path: "/community", element: <Community />, errorElement: <NotFound /> },
        { path: "/blog", element: <Blog />, errorElement: <NotFound /> },
        { path: "/api-documentation", element: <APIDocumentation />, errorElement: <NotFound /> },
        { path: "/about", element: <About />, errorElement: <NotFound /> },
        { path: "/help-center", element: <HelpCenter />, errorElement: <NotFound /> },
        { path: "/privacy", element: <Privacy />, errorElement: <NotFound /> },
        { path: "/terms", element: <Terms />, errorElement: <NotFound /> },
        { path: "/cookie-policy", element: <CookiePolicy />, errorElement: <NotFound /> },
    
        { path: "/diagnostic", element: <DiagnosticPage />, errorElement: <NotFound /> },
       
        { path: "/signup", element: <SignUp />, errorElement: <NotFound /> },
        { path: "/signin", element: <SignIn />, errorElement: <NotFound /> },
        { path: "/forgot-password", element: <ForgotPassword />, errorElement: <NotFound /> },
        { path: "/reset-password", element: <ResetPassword />, errorElement: <NotFound /> },
        
        { path: "/profile", element: <ProtectedRoute><Profile /></ProtectedRoute>, errorElement: <NotFound /> },
        { path: "/pantry", element: <ProtectedRoute><Pantry /></ProtectedRoute>, errorElement: <NotFound /> },
        { path: "/shopping-list", element: <ProtectedRoute><ShoppingList /></ProtectedRoute>, errorElement: <NotFound /> },
         { path: "/meal-planning", element: <ProtectedRoute><MealPlanning /></ProtectedRoute>, errorElement: <NotFound /> },
        { path: "/admin", element: <AdminRoute><AdminDashboard /></AdminRoute>, errorElement: <NotFound /> },
        { path: "/nutrition", element: <ProtectedRoute><NutritionDashboard /></ProtectedRoute>, errorElement: <NotFound /> },
        { path: "/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute>, errorElement: <NotFound /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
