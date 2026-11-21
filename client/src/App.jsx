import { Routes, Route } from 'react-router-dom';
import { ReadingListProvider } from './context/ReadingListContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import BookDetail from './pages/BookDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SpaceBookingPage from './pages/SpaceBookingPage';

function App() {
  return (
    <ReadingListProvider>
      <div className="app-container">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <SpaceBookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-space"
              element={
                <ProtectedRoute>
                  <SpaceBookingPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Athena Library Management System. All rights reserved.</p>
        </footer>
      </div>
    </ReadingListProvider>
  );
}

export default App;
