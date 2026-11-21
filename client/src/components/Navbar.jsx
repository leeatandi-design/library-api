import { Link, useNavigate } from 'react-router-dom';
import { useReadingList } from '../context/ReadingListContext';

function Navbar() {
  const { count } = useReadingList();
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-content">
        <Link to="/" className="brand-logo">
          <span className="logo-icon">📚</span>
          <span className="brand-name">Athena Library</span>
        </Link>
        <nav className="nav-links">
          <Link to="/" className="nav-link">Catalog</Link>
          <Link to="/book-space" className="nav-link">Book a Space</Link>
          <span className="reading-list-badge">
            📖 Reading List: <strong>{count}</strong>
          </span>

          {token ? (
            <div className="auth-menu">
              <span className="user-greeting">Hi, {user?.name || 'Reader'}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="register-nav-btn">Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
