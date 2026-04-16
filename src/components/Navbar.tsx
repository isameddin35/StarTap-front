import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";

interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

export default function Navbar({ isLoggedIn, setIsLoggedIn }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="w-full flex justify-between items-center px-6 py-4 border-b bg-white">
      <Link to="/" className="text-xl font-bold">
        StartTap
      </Link>

      <div className="flex items-center gap-4">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="text-sm">Login</Link>
            <Link to="/register" className="text-sm">Register</Link>
          </>
        ) : (
          <>
            <Link to="/profile">
              <User className="w-6 h-6 cursor-pointer text-gray-700 hover:text-black" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-sm text-red-500"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}