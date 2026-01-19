import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, PlayCircle, Lock } from 'lucide-react';

const CourseDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`/courses/${slug}`);
        setCourse(data);
        
        if (user) {
          try {
            const { data: enrollmentData } = await axios.get(`/enrollments/check/${data._id}`);
            setIsEnrolled(enrollmentData.enrolled);
          } catch (err) {
            console.error('Error checking enrollment:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await axios.post('/enrollments', { courseId: course._id });
      setIsEnrolled(true);
      navigate('/dashboard');
    } catch (error) {
      alert('Enrollment failed');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!course) return <div className="p-8 text-center">Course not found</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl">{course.description}</p>
          
          <div className="flex items-center space-x-4">
            {!isEnrolled ? (
              <button 
                onClick={handleEnroll}
                className="bg-white text-indigo-900 px-8 py-3 rounded-md font-bold hover:bg-gray-100 transition"
              >
                Enroll Now (${course.price})
              </button>
            ) : (
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-green-500 text-white px-8 py-3 rounded-md font-bold hover:bg-green-600 transition"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">Course Content</h2>
          <div className="border rounded-lg overflow-hidden">
            {course.lessons.map((lesson, index) => (
              <div 
                key={index} 
                className="flex items-center p-4 border-b last:border-b-0 hover:bg-gray-50 bg-white"
              >
                <div className="mr-4 text-gray-400">
                  {isEnrolled ? (
                    <PlayCircle className="h-6 w-6" />
                  ) : (
                    <Lock className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{lesson.title}</h3>
                  <span className="text-sm text-gray-500">Lesson {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
