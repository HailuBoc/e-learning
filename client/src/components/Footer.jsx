import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">EduPlatform</h3>
            <p className="text-sm">
              Empowering learners worldwide with high-quality courses and expert instructors.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:text-white transition">Browse Courses</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
              <li><Link to="/signup" className="hover:text-white transition">Sign Up</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses?category=Development" className="hover:text-white transition">Development</Link></li>
              <li><Link to="/courses?category=Business" className="hover:text-white transition">Business</Link></li>
              <li><Link to="/courses?category=Design" className="hover:text-white transition">Design</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition"><Github className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} EduPlatform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
