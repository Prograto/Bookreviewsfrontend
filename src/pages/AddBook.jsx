import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api";

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  function fileToBase64(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setImage(base64);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author || !image) {
      alert("Title, author, and image are required!");
      return;
    }
    setLoading(true);
    try {
      await client.post("/books", {
        title,
        author,
        genre,
        year: parseInt(year) || 0,
        description,
        image,
      });
      alert("Book added successfully!");
      nav("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl"
    >
      <h2 className="text-3xl font-bold text-center text-orange-600 dark:text-orange-400 mb-6">
        Add a New Book
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-400 outline-none"
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-400 outline-none"
          required
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-400 outline-none"
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-400 outline-none"
        />
      </div>

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mt-4 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-400 outline-none"
      />

      <div className="mt-4">
        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-4 h-48 w-full object-cover rounded-xl shadow-md"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Book"}
      </button>
    </form>
  );
}
