import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import VacancyDetailPage from './pages/VacancyDetails';
import StartupDetailPage from './pages/StartupDetails';
import CreateStartupPage from './pages/CreateStartupPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔥 refresh olsa belə login qalır
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route
              path="/login"
              element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
            />

            <Route
              path="/register"
              element={<RegisterPage setIsLoggedIn={setIsLoggedIn} />}
            />

            {/* 🔒 protected route */}
            <Route
              path="/profile"
              element={
                isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />

            <Route path="/vacancies/:id" element={<VacancyDetailPage />} />

            <Route path="/startups/:id" element={<StartupDetailPage />} />

            <Route path="/startups/create" element={<CreateStartupPage />} />

          </Routes>
        </main>

        <footer className="border-t border-gray-200 py-6 mt-auto">
          <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
            © 2026 StartTap
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;