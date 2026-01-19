import { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import { Search } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: ''
  });

  useEffect(() => {
    setLoading(true);
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('/courses', { params: filters });
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Courses</h1>
          
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Search courses..."
                value={filters.search}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
            
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="p-2 border rounded-md bg-white"
            >
              <option value="">All Categories</option>
              <option value="Development">Development</option>
              <option value="Business">Business</option>
              <option value="Design">Design</option>
            </select>
            
            <select
              name="difficulty"
              value={filters.difficulty}
              onChange={handleChange}
              className="p-2 border rounded-md bg-white"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading courses...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length > 0 ? (
              courses.map(course => <CourseCard key={course._id} course={course} />)
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No courses found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
