import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api';

export default function EditReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReview();
  }, []);

  async function fetchReview() {
    try {
      const res = await client.get(`/reviews/${id}`);
      setReview(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch review');
      navigate('/profile');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await client.put(`/reviews/${id}`, review);
      alert('Review updated successfully');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert('Failed to update review');
    }
  }

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Rating (1-5)</label>
          <input
            type="number"
            min={1}
            max={5}
            value={review?.rating || 1}
            onChange={e => setReview({...review, rating: Number(e.target.value)})}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold">Comment</label>
          <textarea
            value={review?.comment || ''}
            onChange={e => setReview({...review, comment: e.target.value})}
            className="w-full border rounded p-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save
        </button>
      </form>
    </div>
  );
}
