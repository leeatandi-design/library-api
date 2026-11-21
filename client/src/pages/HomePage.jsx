import { useState, useEffect, useCallback } from 'react';
import BookGrid from '../components/BookGrid';
import SearchBar from '../components/SearchBar';

function HomePage() {
  const [selectedGenreId, setSelectedGenreId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [sortBy, setSortBy] = useState('title');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetch(`${apiUrl}/genres`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch genres');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setGenres(data);
      })
      .catch((err) => {
        console.warn('Could not load genres:', err);
      });
  }, [apiUrl]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="home-page">
      <div className="catalog-hero">
        <h2>Explore Our Book Catalog</h2>
        <p>Browse through thousands of literary works, textbooks, and memoirs.</p>
      </div>

      <div className="catalog-controls">
        <SearchBar onSearch={handleSearch} />

        <div className="filter-sort-bar">
          <div className="genre-filter-wrapper">
            <label htmlFor="genre-select" className="control-label">Genre:</label>
            <select
              id="genre-select"
              className="control-select"
              value={selectedGenreId}
              onChange={(e) => setSelectedGenreId(e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sort-wrapper">
            <label htmlFor="sort-select" className="control-label">Sort by:</label>
            <select
              id="sort-select"
              className="control-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title">Title (A-Z)</option>
              <option value="author">Author (A-Z)</option>
              <option value="publishedYear">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      <BookGrid
        genreId={selectedGenreId}
        search={searchQuery}
        sortBy={sortBy}
      />
    </div>
  );
}

export default HomePage;
