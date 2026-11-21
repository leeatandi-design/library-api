import { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from './BookCard';

function BookGrid({ genreId, search }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = {};
    if (genreId) params.genreId = genreId;
    if (search) params.search = search;

    axios
      .get(`${apiUrl}/books`, { params })
      .then((res) => {
        setBooks(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        setError('Could not load books right now.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [genreId, search, apiUrl]);

  if (loading) return <p className="loading-state">Loading books...</p>;
  if (error) return <p className="error-state">{error}</p>;
  if (books.length === 0) return <p className="empty-state">No books found.</p>;

  return (
    <div className="book-grid grid grid-cols-3 gap-4">
      {books.map((b) => (
        <BookCard key={b.id} book={b} />
      ))}
    </div>
  );
}

export default BookGrid;
