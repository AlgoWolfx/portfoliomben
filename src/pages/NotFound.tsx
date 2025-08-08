import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import FogBackground from '../components/FogBackground';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <FogBackground />
      <div className="relative z-10 flex items-center justify-center px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-md w-full text-center">
          {/* Message */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-400 text-lg">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Return Home Button */}
          <div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-lg"
            >
              <Home size={20} className="mr-2" />
              Return Home
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Animated Lines */}
            {[...Array(5)].map((_, i) => (
              <div
                key={`line-${i}`}
                className="absolute bg-gray-700/20"
                style={{
                  height: '1px',
                  width: '100%',
                  left: 0,
                  top: `${20 + i * 15}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 