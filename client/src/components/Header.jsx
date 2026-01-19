import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-indigo-600">
          <BookOpen className="h-6 w-6" />
          <span>EduPlatform</span>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link to="/courses" className="text-gray-600 hover:text-indigo-600">
            Browse Courses
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-600 hover:text-indigo-600">
                  Admin
                </Link>
              )}
              <div className="flex items-center space-x-2 border-l pl-4 ml-4">
                <div className="flex items-center space-x-1 text-sm font-medium">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-red-500 hover:text-red-700 ml-2"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-indigo-600">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
