import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api";

export default function Home({ user }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await client.get("/books");
        if (Array.isArray(res.data)) {
          setBooks(res.data);
        } else if (res.data.books) {
          setBooks(res.data.books);
        } else {
          setBooks([]);
        }
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((b) => {
    return (
      (b.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.author?.toLowerCase().includes(search.toLowerCase())) &&
      b.genre?.toLowerCase().includes(genre.toLowerCase()) &&
      b.author?.toLowerCase().includes(author.toLowerCase()) &&
      b.year?.toString().includes(year)
    );
  });

  const totalPages = Math.ceil(filteredBooks.length / perPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  if (loading) return <p className="text-center mt-10">Loading books...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-orange-600 dark:text-orange-400">
          Discover Books
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Browse our collection and find your next great read.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or author..."
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-400 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by genre..."
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-400 outline-none"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by author..."
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-400 outline-none"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by year..."
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-400 outline-none"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>

      {/* Book Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginatedBooks.length ? (
          paginatedBooks.map((book) => (
            <div
              key={book._id}
              onClick={() => navigate(`/book/${book._id}`)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transform transition-all hover:-translate-y-1 cursor-pointer"
            >
              <img
                src={book.image}
                alt={book.title}
                className="rounded-t-2xl h-60 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">{book.title}</h3>
                <p className="text-gray-500 text-sm mb-2">by {book.author}</p>
                <p className="text-orange-500 text-sm font-medium">
                  ⭐ {book.averageRating?.toFixed(1) || 0} / 5
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {book.genre} • {book.year}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-10">
            No books found.
          </p>
        )}
      </div>

      {/* Pagination */}
      {paginatedBooks.length > 0 && (
        <div className="flex justify-center mt-10 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 border rounded-md hover:bg-orange-500 hover:text-white transition"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded-md transition ${
                currentPage === i + 1
                  ? "bg-orange-500 text-white"
                  : "hover:bg-orange-500 hover:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-4 py-2 border rounded-md hover:bg-orange-500 hover:text-white transition"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
