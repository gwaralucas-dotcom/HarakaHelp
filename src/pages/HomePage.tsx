import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Siren, 
  MapPin, 
  Bell, 
  Phone, 
  Waves, 
  Shield, 
  Clock,
  ChevronRight,
  Settings
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useEmergency } from '../App';

const quickActions = [
  { 
    icon: Waves, 
    title: 'Report Flood', 
    desc: 'Report water levels & damage',
    color: 'from-blue-500 to-cyan-400',
    path: '/report-flood',
    bgColor: 'bg-blue-500'
  },
  { 
    icon: Siren, 
    title: 'Emergency', 
    desc: 'Request rescue or medical help',
    color: 'from-red-500 to-orange-400',
    path: '/emergency',
    bgColor: 'bg-red-500'
  },
  { 
    icon: MapPin, 
    title: 'Find Shelter', 
    desc: 'Nearby safe locations',
    color: 'from-green-500 to-emerald-400',
    path: '/map',
    bgColor: 'bg-green-500'
  },
  { 
    icon: Bell, 
    title: 'Alerts', 
    desc: 'Safety instructions',
    color: 'from-amber-500 to-yellow-400',
    path: '/alerts',
    bgColor: 'bg-amber-500'
  },
];

const emergencyContacts = [
  { name: 'Emergency Services', number: '911', icon: Phone },
  { name: 'Flood Hotline', number: '1800-FLOOD', icon: Phone },
  { name: 'Medical Emergency', number: '911', icon: Phone },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { setUserLocation, activeAlert } = useEmergency();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Default location (NYC) if permission denied
          setUserLocation({ lat: 40.7128, lng: -74.006 });
        }
      );
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [setUserLocation]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-dvh pb-4">
      {/* Header */}
      <header 
        className="p-4 pt-6"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">
              HarakaHelp
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {formatDate(currentTime)} • {formatTime(currentTime)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/admin')}
              className="bg-slate-700 p-2 rounded-xl"
              title="Admin Dashboard"
            >
              <Settings className="w-5 h-5 text-slate-300" />
            </motion.button>
            <div className="bg-red-500/20 px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-xs font-medium">LIVE</span>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Active Alert Banner */}
      {activeAlert && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-4 mb-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Active Alert in Your Area</p>
              <p className="text-white/80 text-xs">{activeAlert}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/70" />
          </div>
        </motion.div>
      )}

      {/* Quick Actions Grid */}
      <section className="px-4 mt-2">
        <h2 className="text-white font-semibold text-lg mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              onClick={() => navigate(action.path)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 text-left border border-slate-700/50 hover:border-red-500/30 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-sm">{action.title}</h3>
              <p className="text-slate-400 text-xs mt-1">{action.desc}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="px-4 mt-6">
        <h2 className="text-white font-semibold text-lg mb-3">Emergency Contacts</h2>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          {emergencyContacts.map((contact, index) => (
            <motion.button
              key={contact.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="w-full flex items-center gap-4 p-4 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30 transition-colors"
            >
              <div className="bg-red-500/20 p-2 rounded-xl">
                <contact.icon className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-medium text-sm">{contact.name}</p>
                <p className="text-red-400 text-xs">{contact.number}</p>
              </div>
              <Phone className="w-5 h-5 text-green-500" />
            </motion.button>
          ))}
        </div>
      </section>

      {/* Status Card */}
      <section className="px-4 mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500/20 p-2 rounded-xl">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Your Safety Status</h3>
              <p className="text-slate-400 text-xs">Last updated: Just now</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-green-400 text-sm font-medium">Location shared with emergency services</span>
          </div>
        </motion.div>
      </section>

      {/* Tips Section */}
      <section className="px-4 mt-6 pb-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-amber-500/10 rounded-2xl p-4 border border-amber-500/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-amber-400 font-semibold">Safety Tip</h3>
          </div>
          <p className="text-slate-300 text-sm">
            Keep your phone charged and stay tuned to local emergency broadcasts. 
            Move to higher ground immediately if you notice rising water levels.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
