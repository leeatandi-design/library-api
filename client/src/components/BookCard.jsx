import { Link } from 'react-router-dom';

function BookCard({ book }) {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p>by {book.author}</p>
      {book.description && <p>{book.description}</p>}
      <Link to={`/books/${book.id}`} className="view-detail-btn">
        View Details
      </Link>
    </div>
  );
}

export default BookCard;
