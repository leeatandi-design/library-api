import { useState, useEffect } from 'react';
import BookCard from './BookCard';

function BookGrid({ genreId, search, sortBy = 'title' }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams();
    if (genreId) queryParams.set('genreId', genreId);
    if (search && search.trim()) queryParams.set('search', search.trim());

    const url = `${apiUrl}/books?${queryParams.toString()}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch books (Status: ${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (!isCancelled) {
          setBooks(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err.message || 'An error occurred while loading books.');
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [genreId, search, apiUrl]);

  // Sort books client-side for stretch goal
  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === 'author') {
      return a.author.localeCompare(b.author);
    }
    if (sortBy === 'publishedYear') {
      return b.publishedYear - a.publishedYear;
    }
    return a.title.localeCompare(b.title);
  });

  // Skeleton loading state
  if (loading) {
    return (
      <div className="book-grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="book-card skeleton-card">
            <div className="skeleton skeleton-badge"></div>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-subtitle"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-btn"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="state-container error-state">
        <span className="state-icon">⚠️</span>
        <h3>Could not load books</h3>
        <p>{error}</p>
        <button
          className="retry-btn"
          onClick={() => {
            setLoading(true);
            setError(null);
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (sortedBooks.length === 0) {
    return (
      <div className="state-container empty-state">
        <span className="state-icon">📖</span>
        <h3>No books found</h3>
        <p>Try adjusting your search query or picking a different genre filter.</p>
      </div>
    );
  }

  // Loaded books state
  return (
    <div className="book-grid">
      {sortedBooks.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export default BookGrid;
