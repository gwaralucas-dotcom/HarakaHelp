import { NavLink } from 'react-router-dom';
import { Home, AlertTriangle, Siren, Bell, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/report-flood', icon: AlertTriangle, label: 'Report' },
  { to: '/emergency', icon: Siren, label: 'Emergency' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/map', icon: MapPin, label: 'Shelters' },
];

export default function BottomNav() {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-red-500/30"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                isActive ? 'text-red-500' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                className="flex flex-col items-center"
                whileTap={{ scale: 0.9 }}
              >
                <div className={`relative p-2 rounded-xl ${isActive ? 'bg-red-500/20' : ''}`}>
                  <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"
                    />
                  )}
                </div>
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
