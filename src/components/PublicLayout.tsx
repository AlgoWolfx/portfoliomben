import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import FogBackground from './FogBackground';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <FogBackground />
      <div className="relative z-10">
        <Navigation />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PublicLayout; 