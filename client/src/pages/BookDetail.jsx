import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${apiUrl}/books/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Book not found (Status: ${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (!isCancelled) {
          setBook(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err.message || 'Failed to load book details.');
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [id, apiUrl]);

  if (loading) {
    return (
      <div className="book-detail-container">
        <div className="skeleton-detail">
          <div className="skeleton skeleton-badge"></div>
          <div className="skeleton skeleton-title" style={{ height: '36px', width: '70%' }}></div>
          <div className="skeleton skeleton-subtitle" style={{ width: '40%' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '100px' }}></div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="book-detail-container">
        <div className="state-container error-state">
          <span className="state-icon">⚠️</span>
          <h3>Error loading book</h3>
          <p>{error || 'Book does not exist'}</p>
          <Link to="/" className="back-link">&larr; Back to Catalog</Link>
        </div>
      </div>
    );
  }

  const availableCopies = book.totalCopies ?? book.copiesAvailable ?? 0;

  return (
    <div className="book-detail-container">
      <Link to="/" className="back-link">&larr; Back to Catalog</Link>

      <div className="book-detail-card">
        <div className="book-detail-header">
          <div className="tags">
            <span className="genre-badge">{book.genre?.name || 'General'}</span>
            <span className={`stock-badge ${availableCopies > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {availableCopies > 0 ? `${availableCopies} copies available` : 'Out of Stock'}
            </span>
          </div>
          <h1 className="book-detail-title">{book.title}</h1>
          <p className="book-detail-author">By <span className="highlight-author">{book.author}</span></p>
        </div>

        <div className="book-detail-grid">
          <div className="detail-item">
            <span className="detail-label">ISBN</span>
            <span className="detail-value">{book.isbn}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Published Year</span>
            <span className="detail-value">{book.publishedYear}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Total Copies</span>
            <span className="detail-value">{availableCopies}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Genre</span>
            <span className="detail-value">{book.genre?.name || 'Unassigned'}</span>
          </div>
        </div>

        {book.reviews && book.reviews.length > 0 && (
          <div className="reviews-section">
            <h3>Reader Reviews ({book.reviews.length})</h3>
            <div className="reviews-list">
              {book.reviews.map((rev) => (
                <div key={rev.id} className="review-card">
                  <div className="review-header">
                    <span className="review-rating">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                    <span className="review-user">{rev.user?.name || 'Patron'}</span>
                  </div>
                  {rev.comment && <p className="review-comment">{rev.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookDetail;
