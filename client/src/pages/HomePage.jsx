import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import BookGrid from '../components/BookGrid';

function HomePage() {
  const [genreId, setGenreId] = useState('');
  const [search, setSearch] = useState('');

  return (
    <div className="home-page">
      <div className="catalog-hero">
        <h2>Explore Our Book Catalog</h2>
        <p>Browse through literary works, textbooks, and memoirs.</p>
      </div>

      <div className="catalog-controls">
        <SearchBar onSearch={setSearch} />
        <GenreFilter value={genreId} onChange={setGenreId} />
      </div>

      <BookGrid genreId={genreId} search={search} />
    </div>
  );
}

export default HomePage;
