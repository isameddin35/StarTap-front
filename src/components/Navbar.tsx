import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, LogOut, Zap } from "lucide-react";

interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

export default function Navbar({ isLoggedIn, setIsLoggedIn }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Playfair+Display:wght@700&display=swap');

        .st-nav {
          position: sticky; top: 0; z-index: 50;
          width: 100%;
          font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
          transition: background 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .st-nav.scrolled {
          background: rgba(250,250,248,0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 #e8e6de;
        }
        .st-nav.top {
          background: #fafaf8;
          box-shadow: 0 1px 0 #e8e6de;
        }

        .st-nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .st-logo {
          display: flex; align-items: center; gap: 7px;
          text-decoration: none;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 20px;
          font-weight: 700;
          color: #0f0f0d;
          letter-spacing: -0.02em;
          transition: opacity 0.15s;
        }
        .st-logo:hover { opacity: 0.75; }

        .st-logo-icon {
          width: 28px; height: 28px;
          background: #EEEDFE;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }

        .st-nav-link {
          font-size: 14px; font-weight: 400;
          color: #6b6b5e; text-decoration: none;
          padding: 6px 10px; border-radius: 8px;
          transition: color 0.15s, background 0.15s;
          position: relative;
        }
        .st-nav-link:hover {
          color: #0f0f0d;
          background: #f1efe8;
        }
        .st-nav-link.active {
          color: #534AB7;
          background: #EEEDFE;
          font-weight: 500;
        }

        .st-nav-register {
          font-size: 14px; font-weight: 500;
          color: #fff; text-decoration: none;
          padding: 7px 16px; border-radius: 10px;
          background: #1a1a18;
          transition: background 0.15s, transform 0.12s;
        }
        .st-nav-register:hover {
          background: #333;
          transform: translateY(-1px);
        }

        .st-icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 10px;
          color: #6b6b5e; text-decoration: none;
          transition: background 0.15s, color 0.15s;
          border: none; background: transparent; cursor: pointer;
        }
        .st-icon-btn:hover {
          background: #f1efe8;
          color: #0f0f0d;
        }
        .st-icon-btn.logout:hover {
          background: #FAECE7;
          color: #993C1D;
        }

        .st-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: #EEEDFE; color: #534AB7;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600;
        }
      `}</style>

      <nav className={`st-nav ${scrolled ? "scrolled" : "top"}`}>
        <div className="st-nav-inner">

          {/* Logo */}
          <Link to="/" className="st-logo">
            <div className="st-logo-icon">
              <Zap size={14} color="#7F77DD" strokeWidth={2.5} />
            </div>
            StartTap
          </Link>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className={`st-nav-link ${location.pathname === "/login" ? "active" : ""}`}
                >
                  Giriş
                </Link>
                <Link to="/register" className="st-nav-register">
                  Qeydiyyat
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="st-icon-btn"
                  title="Profil"
                >
                  <div className="st-avatar">
                    <User size={14} />
                  </div>
                </Link>

                <div style={{ width: 1, height: 20, background: "#e8e6de", margin: "0 2px" }} />

                <button
                  onClick={handleLogout}
                  className="st-icon-btn logout"
                  title="Çıxış"
                >
                  <LogOut size={16} strokeWidth={1.75} />
                </button>
              </>
            )}
          </div>

        </div>
      </nav>
    </>
  );
}