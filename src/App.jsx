import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  LogOut,
  User,
  Home as HomeIcon,
  PlusCircle,
  Phone,
} from "lucide-react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddBook from "./pages/AddBook";
import BookPage from "./pages/BookPage";
import Profile from "./pages/Profile";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme === "dark" ? "dark" : "light"
    );
    localStorage.setItem("theme", theme);
  }, [theme]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen font-inter">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-orange-600 dark:text-orange-400"
          >
            📚 BookReview
          </Link>

          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-orange-500 transition"
            >
              <HomeIcon className="w-4 h-4" /> Home
            </Link>
            {user && (
              <>
                <Link
                  to="/add"
                  className="flex items-center gap-1 hover:text-orange-500 transition"
                >
                  <PlusCircle className="w-4 h-4" /> Add Book
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-1 hover:text-orange-500 transition"
                >
                  <User className="w-4 h-4" /> Profile
                </Link>
              </>
            )}
            <a
              href="tel:+91-XXXXXXXXXX"
              className="flex items-center gap-1 hover:text-orange-500 transition"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={() =>
                setTheme((prev) => (prev === "dark" ? "light" : "dark"))
              }
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-700" />
              )}
            </button>

            {user ? (
              <button
                onClick={logout}
                className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Routes */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookPage />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/signup" element={<Signup onSignup={setUser} />} />
          <Route path="/add" element={<AddBook />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
