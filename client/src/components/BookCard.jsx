import { Link } from 'react-router-dom';
import { useReadingList } from '../context/ReadingListContext';

function BookCard({ book }) {
  const { items, addBook, removeBook } = useReadingList();
  const genreName = book.genre?.name || 'General';
  const availableCopies = book.totalCopies ?? book.copiesAvailable ?? 0;

  const isInList = items.some((item) => item.id === book.id);

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
        <div className="card-actions">
          <Link to={`/books/${book.id}`} className="view-detail-btn">
            View Details &rarr;
          </Link>
          <button
            type="button"
            className={`reading-list-btn ${isInList ? 'in-list' : ''}`}
            onClick={() => (isInList ? removeBook(book.id) : addBook(book))}
          >
            {isInList ? '✓ In List' : '+ Add to List'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
