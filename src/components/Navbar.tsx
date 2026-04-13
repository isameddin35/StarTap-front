import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

export default function Navbar({ isLoggedIn, setIsLoggedIn }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          StartTap
        </Link>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Logout
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  className={`border-gray-300 text-gray-700 hover:bg-gray-50 ${
                    location.pathname === '/login' ? 'bg-gray-100' : ''
                  }`}
                >
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  className={`bg-gray-900 text-white hover:bg-gray-800 ${
                    location.pathname === '/register' ? 'ring-2 ring-offset-2 ring-gray-900' : ''
                  }`}
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
