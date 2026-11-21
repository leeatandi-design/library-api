import { useState, useEffect } from 'react';
import axios from 'axios';

function GenreFilter({ value, onChange }) {
  const [genres, setGenres] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    axios
      .get(`${apiUrl}/genres`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setGenres(res.data);
        }
      })
      .catch((err) => {
        console.warn('Could not load genres:', err);
      });
  }, [apiUrl]);

  return (
    <select
      aria-label="Filter by genre"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="control-select"
    >
      <option value="">All Genres</option>
      {genres.map((g) => (
        <option key={g.id} value={g.id}>
          {g.name}
        </option>
      ))}
    </select>
  );
}

export default GenreFilter;
