import React, { useEffect, useState } from 'react';
import client from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [ownBooks, setOwnBooks] = useState([]);
  const [givenReviews, setGivenReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate('/login'); // redirect if not logged in
    else fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      const res = await client.get('/books?page=1&limit=100');

      const myBooks = res.data.books.filter(
        b => b.owner === user.id || b.owner === (user._id || user.id)
      );
      setOwnBooks(myBooks);

      const reviews = [];
      for (const b of res.data.books) {
        if (b.reviews && b.reviews.length) {
          for (const r of b.reviews) {
            if (r.user && (r.user === user.id || r.user._id === user.id))
              reviews.push({ ...r, bookTitle: b.title, bookImage: b.image });
          }
        }
      }
      setGivenReviews(reviews);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  async function handleDeleteBook(bookId) {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      const res = await client.delete(`/books/${bookId}`);
      if (res.data.message) {
        setOwnBooks(prev => prev.filter(b => b._id !== bookId));
        alert('Book deleted successfully');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete book');
    }
  }

  async function handleDeleteReview(reviewId) {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await client.delete(`/reviews/${reviewId}`);
      if (res.data.message) {
        setGivenReviews(prev => prev.filter(r => r._id !== reviewId));
        alert('Review deleted successfully');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete review');
    }
  }

  const pieData = [5, 4, 3, 2, 1].map(rating => ({
    name: `${rating} Stars`,
    value: givenReviews.filter(r => r.rating === rating).length,
  }));
  const COLORS = ['#4ade80', '#60a5fa', '#f59e0b', '#fb7185', '#a78bfa'];

  if (loading) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="space-y-10 px-4 md:px-10">
      <h2 className="text-3xl font-bold text-center mb-6">{user?.name}'s Profile</h2>

      {/* My Books Section */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">My Books</h3>
        {ownBooks.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownBooks.map(book => (
              <div key={book._id} className="bg-var(--card) rounded-lg shadow-lg overflow-hidden flex flex-col">
                <div className="h-60 bg-gray-100 flex items-center justify-center">
                  {book.image ? (
                    <img src={book.image} alt={book.title} className="h-full object-contain" />
                  ) : (
                    <div className="text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="font-semibold text-lg">{book.title}</div>
                  <div className="text-sm text-gray-600">{book.author || 'Unknown Author'}</div>
                  <div className="mt-2 text-sm text-gray-700">
                    Avg Rating: {book.averageRating ? book.averageRating.toFixed(1) : '—'} ({book.reviews?.length || 0})
                  </div>
                  <div className="mt-auto flex gap-2 pt-3">
                    <Link
                      to={`/edit-book/${book._id}`}
                      className="flex-1 text-center bg-blue-500 text-white rounded py-1 hover:bg-blue-600 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteBook(book._id)}
                      className="flex-1 text-center bg-red-500 text-white rounded py-1 hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">You have not added any books yet.</div>
        )}
      </section>

      {/* My Reviews Section */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">My Reviews</h3>
        {givenReviews.length ? (
          <div className="space-y-4">
            {givenReviews.map(r => (
              <div key={r._id} className="flex items-center gap-4 p-4 border rounded-lg bg-var(--card) shadow-sm">
                <div className="w-16 h-20 flex-shrink-0">
                  {r.bookImage ? (
                    <img src={r.bookImage} alt={r.bookTitle} className="w-full h-full object-cover rounded" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm rounded">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{r.bookTitle}</div>
                  <div className="text-sm text-gray-600">Rating: {r.rating}</div>
                  <div className="text-sm mb-2">{r.comment}</div>
                  <div className="flex gap-2">
                    <Link
                      to={`/edit-review/${r._id}`}
                      className="text-center bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-600 transition text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteReview(r._id)}
                      className="text-center bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">You have not given any reviews yet.</div>
        )}

        {/* Ratings Distribution Pie Chart */}
        <div className="mt-6 bg-var(--card) p-4 rounded-lg shadow-md">
          <h4 className="font-semibold mb-2 text-center">Ratings Distribution</h4>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={value => `${value} review(s)`} />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
