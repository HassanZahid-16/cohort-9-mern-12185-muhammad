import { Link, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }
  
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          NOTES
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <span className="user-greeting">
            Hello, {user?.fullName}
          </span>

          <button type="button" onClick={handleLogout}>
            Log out
          </button>
        </nav>
      </header>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;