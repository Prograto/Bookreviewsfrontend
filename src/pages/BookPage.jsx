import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaStar } from "react-icons/fa";

export default function BookPage({ user }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState(null); // review id being edited
  const [editingComment, setEditingComment] = useState("");
  const [editingRating, setEditingRating] = useState(0);

  useEffect(() => {
    fetchBook();
  }, [id]);

  async function fetchBook() {
    setLoading(true);
    try {
      const res = await client.get(`/books/${id}`);
      setBook(res.data);
    } catch (err) {
      console.error(err);
      setBook(null);
    } finally {
      setLoading(false);
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    if (!comment || rating === 0) return alert("Please add a rating and comment");
    try {
      await client.post("/reviews", { bookId: id, rating, comment });
      setComment("");
      setRating(0);
      fetchBook();
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting review");
    }
  }

  async function deleteReview(reviewId) {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await client.delete(`/reviews/${reviewId}`);
      fetchBook();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting review");
    }
  }

  async function updateReview(reviewId, newRating, newComment) {
    if (!newComment || newRating === 0) return alert("Please add a rating and comment");
    try {
      await client.put(`/reviews/${reviewId}`, { rating: newRating, comment: newComment });
      setEditingReviewId(null);
      fetchBook();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating review");
    }
  }

  function buildRatingHistogram(reviews) {
    return [1, 2, 3, 4, 5].map((n) => ({
      rating: n,
      count: reviews.filter((r) => r.rating === n).length,
    }));
  }

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!book) return <div className="text-center mt-10">Book not found</div>;

  const StarRating = ({ ratingValue, setRatingValue }) => (
    <div className="flex gap-1 cursor-pointer">
      {[...Array(5)].map((_, i) => {
        const val = i + 1;
        return (
          <FaStar
            key={i}
            size={20}
            className={val <= ratingValue ? "text-yellow-400" : "text-gray-300 dark:text-gray-500"}
            onClick={() => setRatingValue(val)}
          />
        );
      })}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
      {/* Book Info */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-80 object-contain rounded-xl"
            />
          ) : (
            <div className="h-80 flex items-center justify-center border rounded-xl">No image</div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold">{book.title}</h2>
          <p className="text-gray-500 mt-1">
            By {book.author} • {book.year}
          </p>
          <p className="text-orange-500 mt-2 font-semibold">
            ⭐ {book.averageRating?.toFixed(1) || 0} / 5 ({book.reviewsCount})
          </p>
          <p className="mt-4 text-gray-700 dark:text-gray-200">{book.description}</p>
        </div>
      </div>

      {/* Review Form */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Leave a Review</h3>
        <form
          onSubmit={submitReview}
          className="flex flex-col md:flex-row gap-2 items-start md:items-center"
        >
          <StarRating ratingValue={rating} setRatingValue={setRating} />
          <input
            className="flex-1 p-2 border rounded"
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md">
            Submit
          </button>
        </form>
      </section>

      {/* Reviews & Ratings */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reviews */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Reviews</h4>
          <div className="space-y-4">
            {book.reviews.length ? (
              book.reviews.map((r) => (
                <div
                  key={r._id}
                  className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 relative"
                >
                  {editingReviewId === r._id ? (
                    <div className="flex flex-col gap-2">
                      <StarRating
                        ratingValue={editingRating}
                        setRatingValue={setEditingRating}
                      />
                      <input
                        className="p-2 border rounded"
                        value={editingComment}
                        onChange={(e) => setEditingComment(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          className="px-4 py-1 bg-orange-600 text-white rounded-md"
                          onClick={() =>
                            updateReview(r._id, editingRating, editingComment)
                          }
                        >
                          Update
                        </button>
                        <button
                          className="px-4 py-1 bg-gray-400 text-white rounded-md"
                          onClick={() => setEditingReviewId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold">{r.user?.name || "Unknown"}</p>
                      <div className="flex gap-1 my-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            size={16}
                            className={
                              i < r.rating
                                ? "text-yellow-400"
                                : "text-gray-300 dark:text-gray-500"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{r.comment}</p>
                      {user && r.user?._id === user.id && (
                        <div className="absolute top-2 right-2 flex gap-2 text-sm">
                          <button
                            onClick={() => {
                              setEditingReviewId(r._id);
                              setEditingRating(r.rating);
                              setEditingComment(r.comment);
                            }}
                            className="text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteReview(r._id)}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>

        {/* Rating Distribution */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Ratings Distribution</h4>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildRatingHistogram(book.reviews)}>
                <XAxis dataKey="rating" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
