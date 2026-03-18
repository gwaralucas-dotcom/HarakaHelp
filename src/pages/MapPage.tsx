import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  ChevronLeft,
  Navigation,
  Building2,
  Hospital,
  Home,
  Clock,
  Users,
  ChevronRight
} from 'lucide-react';
import { useEmergency } from '../App';
import { getShelters } from '../utils/storage';

const typeFilters = [
  { id: 'all', label: 'All', icon: MapPin },
  { id: 'shelter', label: 'Shelters', icon: Home },
  { id: 'hospital', label: 'Hospitals', icon: Hospital },
  { id: 'relief', label: 'Relief Centers', icon: Building2 },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'shelter': return Home;
    case 'hospital': return Hospital;
    case 'relief': return Building2;
    default: return MapPin;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'shelter': return 'bg-green-500';
    case 'hospital': return 'bg-red-500';
    case 'relief': return 'bg-blue-500';
    default: return 'bg-slate-500';
  }
};

export default function MapPage() {
  const navigate = useNavigate();
  const { userLocation } = useEmergency();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [shelters, setShelters] = useState<any[]>([]);

  useEffect(() => {
    setShelters(getShelters());
  }, []);

  const filteredLocations = selectedFilter === 'all' 
    ? shelters 
    : shelters.filter((loc: any) => loc.type === selectedFilter);

  return (
    <div className="min-h-dvh pb-4">
      {/* Header */}
      <header className="p-4 pt-6" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="bg-slate-800 p-2 rounded-xl"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Nearby Resources</h1>
              <p className="text-slate-400 text-xs">Shelters, hospitals & relief centers</p>
            </div>
          </div>
        </div>
      </header>

      {/* Current Location */}
      <div className="px-4 mt-2">
        <div className="bg-slate-800/50 rounded-xl p-3 flex items-center justify-between border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <MapPin className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Your Location</p>
              <p className="text-slate-400 text-xs">
                {userLocation 
                  ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                  : 'Locating...'}
              </p>
            </div>
          </div>
          <button className="bg-blue-500/20 p-2 rounded-lg">
            <Navigation className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {typeFilters.map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 px-4 py-2 rounded-xl border-2 transition-all flex items-center gap-2 ${
                selectedFilter === filter.id
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-slate-700 bg-slate-800/50'
              }`}
            >
              <filter.icon className={`w-4 h-4 ${selectedFilter === filter.id ? 'text-red-400' : 'text-slate-400'}`} />
              <span className={`text-sm ${selectedFilter === filter.id ? 'text-white' : 'text-slate-400'}`}>
                {filter.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="px-4 mt-4">
        <div className="relative bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700" style={{ height: '200px' }}>
          {/* Abstract map visualization */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `linear-gradient(to right, #475569 1px, transparent 1px),
                               linear-gradient(to bottom, #475569 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }} />
            
            {/* User location */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-30" />
              </div>
            </motion.div>

            {/* Nearby locations */}
            {filteredLocations.slice(0, 4).map((loc: any, index: number) => (
              <motion.div
                key={loc.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="absolute"
                style={{
                  top: `${30 + (index * 15) % 40}%`,
                  left: `${20 + (index * 20) % 60}%`,
                }}
              >
                <button
                  onClick={() => setSelectedLocation(loc)}
                  className={`w-6 h-6 ${getTypeColor(loc.type)} rounded-full flex items-center justify-center shadow-lg hover:scale-125 transition-transform`}
                >
                  <span className="text-white text-xs">+</span>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Map legend */}
          <div className="absolute bottom-2 left-2 flex gap-2">
            <span className="bg-slate-900/80 px-2 py-1 rounded text-xs text-slate-300">
              {filteredLocations.length} locations nearby
            </span>
          </div>
        </div>
      </div>

      {/* Location List */}
      <section className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold text-lg">Nearby Locations</h2>
          <span className="text-slate-400 text-sm">{filteredLocations.length} found</span>
        </div>

        <div className="space-y-3">
          {filteredLocations.map((location: any, index: number) => {
            const TypeIcon = getTypeIcon(location.type);
            return (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedLocation(location)}
                className={`bg-slate-800/50 rounded-xl p-4 border transition-all cursor-pointer ${
                  selectedLocation?.id === location.id
                    ? 'border-red-500 bg-red-500/5'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${getTypeColor(location.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <TypeIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-white font-medium text-sm">{location.name}</h3>
                        <p className="text-slate-400 text-xs">{location.address}</p>
                      </div>
                      <span className="text-red-400 font-medium text-sm">{location.distance}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400 text-xs">{location.capacity}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-green-400" />
                        <span className="text-green-400 text-xs">{location.open ? 'Open' : 'Closed'}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 flex-shrink-0" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Selected Location Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end z-50"
            onClick={() => setSelectedLocation(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-slate-900 rounded-t-3xl w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 ${getTypeColor(selectedLocation.type)} rounded-2xl flex items-center justify-center`}>
                  {(() => {
                    const Icon = getTypeIcon(selectedLocation.type);
                    return <Icon className="w-7 h-7 text-white" />;
                  })()}
                </div>
                <div className="flex-1">
                  <h2 className="text-white font-bold text-lg">{selectedLocation.name}</h2>
                  <p className="text-slate-400 text-sm">{selectedLocation.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-red-400 font-medium">{selectedLocation.distance}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-green-400">Open</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-800/50 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-1">Capacity</p>
                  <p className="text-white font-medium">{selectedLocation.capacity}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-1">Type</p>
                  <p className="text-white font-medium capitalize">{selectedLocation.type}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-slate-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                  onClick={() => setSelectedLocation(null)}
                >
                  Close
                </button>
                <button
                  className="flex-1 bg-red-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                  onClick={() => {
                    // In a real app, this would open maps navigation
                    alert(`Opening navigation to ${selectedLocation.name}`);
                    setSelectedLocation(null);
                  }}
                >
                  <Navigation className="w-5 h-5" />
                  Navigate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
