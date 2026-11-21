import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    axios
      .get(`${apiUrl}/books/${id}`)
      .then((res) => setBook(res.data))
      .catch((err) => console.error(err));
  }, [id, apiUrl]);

  if (!book) return <p>Loading...</p>;

  return (
    <div className="book-detail">
      <Link to="/" className="back-link">&larr; Back to Catalog</Link>
      <h1>{book.title}</h1>
      <p>by {book.author}</p>
      {book.description && <p>{book.description}</p>}
    </div>
  );
}

export default BookDetail;
