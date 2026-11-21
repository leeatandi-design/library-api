import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookDetail from './pages/BookDetail';

function App() {
  return (
    <div className="app-container">
      <header className="navbar">
        <div className="nav-content">
          <Link to="/" className="brand-logo">
            <span className="logo-icon">📚</span>
            <span className="brand-name">Athena Library</span>
          </Link>
          <nav className="nav-links">
            <Link to="/" className="nav-link">Catalog</Link>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetail />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Athena Library Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
