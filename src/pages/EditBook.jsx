import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api';

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBook();
  }, []);

  async function fetchBook() {
    try {
      const res = await client.get(`/books/${id}`);
      setBook(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch book');
      navigate('/profile');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await client.put(`/books/${id}`, book);
      alert('Book updated successfully');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert('Failed to update book');
    }
  }

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['title','author','genre','year','image','description'].map(key => (
          <div key={key}>
            <label className="block font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            {key === 'description' ? (
              <textarea
                value={book[key] || ''}
                onChange={e => setBook({...book, [key]: e.target.value})}
                className="w-full border rounded p-2"
              />
            ) : (
              <input
                type={key==='year'?'number':'text'}
                value={book[key] || ''}
                onChange={e => setBook({...book, [key]: e.target.value})}
                className="w-full border rounded p-2"
              />
            )}
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save
        </button>
      </form>
    </div>
  );
}
