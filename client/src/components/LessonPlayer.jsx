import { useState } from 'react';
import { Play, CheckCircle } from 'lucide-react';

const LessonPlayer = ({ lesson, onComplete, isCompleted }) => {
  if (!lesson) return <div className="p-8 text-center">Select a lesson to start learning</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
        {lesson.videoUrl && (
          <div className="aspect-w-16 aspect-h-9 bg-gray-900 rounded-lg overflow-hidden mb-4 relative">
             {/* Placeholder for video player */}
             <div className="absolute inset-0 flex items-center justify-center text-white">
                <Play className="h-16 w-16 opacity-50" />
             </div>
             <iframe 
               src={lesson.videoUrl.replace('watch?v=', 'embed/')} 
               className="w-full h-96" 
               title={lesson.title}
               allowFullScreen
            ></iframe>
          </div>
        )}
      </div>

      <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: lesson.contentHtml }} />

      <div className="flex justify-end">
        <button
          onClick={onComplete}
          disabled={isCompleted}
          className={`flex items-center px-6 py-3 rounded-md font-bold transition ${
            isCompleted 
              ? 'bg-green-100 text-green-700 cursor-default' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Completed
            </>
          ) : (
            'Mark as Complete'
          )}
        </button>
      </div>
    </div>
  );
};

export default LessonPlayer;
