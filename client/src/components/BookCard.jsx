import { Link } from 'react-router-dom';

function BookCard({ book }) {
  const genreName = book.genre?.name || 'General';
  const availableCopies = book.totalCopies ?? book.copiesAvailable ?? 0;

  return (
    <div className="book-card">
      <div className="book-card-header">
        <span className="genre-badge">{genreName}</span>
        <span className={`stock-badge ${availableCopies > 0 ? 'in-stock' : 'out-of-stock'}`}>
          {availableCopies > 0 ? `${availableCopies} in stock` : 'Unavailable'}
        </span>
      </div>

      <div className="book-card-body">
        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>
        <p className="book-author">by {book.author}</p>
        <p className="book-meta">
          <span>Year: {book.publishedYear}</span>
          <span>ISBN: {book.isbn}</span>
        </p>
      </div>

      <div className="book-card-footer">
        <Link to={`/books/${book.id}`} className="view-detail-btn">
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
}

export default BookCard;
