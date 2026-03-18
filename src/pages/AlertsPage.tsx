import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  ChevronLeft,
  Shield,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle,
  X
} from 'lucide-react';
import { getAlerts } from '../utils/storage';

const safetyTipsData = {
  flood: [
    'Move to higher ground immediately',
    'Do not walk or drive through flood water',
    'Avoid bridges over fast-moving water',
    'Keep electronics away from water',
    'If trapped, go to the highest level',
  ],
  evacuation: [
    'Follow official evacuation routes only',
    'Take essential documents with you',
    'Shut off utilities before leaving',
    'Check on neighbors who may need help',
    'Do not return until officially cleared',
  ],
  weather: [
    'Stay indoors away from windows',
    'Avoid using electrical appliances',
    'Keep emergency supplies ready',
    'Listen to weather updates',
    'Secure outdoor furniture',
  ],
  shelter: [
    'Bring bedding and medications',
    'Follow shelter staff instructions',
    'Keep pets in designated areas',
    'Register with shelter on arrival',
    'Stay connected with family members',
  ],
};

const alertCategories = [
  { id: 'flood', label: 'Flood', icon: '🌊', color: 'from-blue-500 to-cyan-400' },
  { id: 'evacuation', label: 'Evacuation', icon: '🏃', color: 'from-orange-500 to-red-500' },
  { id: 'weather', label: 'Weather', icon: '⛈️', color: 'from-purple-500 to-pink-400' },
  { id: 'shelter', label: 'Shelter', icon: '🏠', color: 'from-green-500 to-emerald-400' },
];

export default function AlertsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('flood');
  const [readTips, setReadTips] = useState<string[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    setAlerts(getAlerts());
  }, []);

  const markTipAsRead = (tip: string) => {
    if (!readTips.includes(tip)) {
      setReadTips([...readTips, tip]);
    }
  };

  const dismissAlert = (id: number) => {
    setDismissedAlerts([...dismissedAlerts, id]);
  };

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));

  const safetyTips = safetyTipsData[selectedCategory as keyof typeof safetyTipsData] || safetyTipsData.flood;

  return (
    <div className="min-h-dvh pb-4">
      {/* Header */}
      <header className="p-4 pt-6" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="bg-slate-800 p-2 rounded-xl"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Alerts & Safety</h1>
            <p className="text-slate-400 text-xs">Stay informed and safe</p>
          </div>
        </div>
      </header>

      {/* Active Alerts Banner */}
      {visibleAlerts.length > 0 && (
        <div className="px-4 mt-4">
          <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-3 h-3 bg-white rounded-full"
              />
              <span className="text-white font-semibold">Active Alerts</span>
            </div>
            {visibleAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 rounded-xl p-3 mb-2 last:mb-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium text-sm">{alert.title}</p>
                    <p className="text-white/70 text-xs">{alert.location} • {alert.time}</p>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <section className="px-4 mt-6">
        <h2 className="text-white font-semibold text-lg mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-3"
          >
            <Phone className="w-6 h-6 text-green-400" />
            <span className="text-white font-medium">Call Emergency</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/map')}
            className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 flex items-center gap-3"
          >
            <MapPin className="w-6 h-6 text-blue-400" />
            <span className="text-white font-medium">Find Shelter</span>
          </motion.button>
        </div>
      </section>

      {/* Safety Tips Categories */}
      <section className="px-4 mt-6">
        <h2 className="text-white font-semibold text-lg mb-3">Safety Instructions</h2>
        
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {alertCategories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 px-4 py-2 rounded-xl border-2 transition-all ${
                selectedCategory === category.id
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-slate-700 bg-slate-800/50'
              }`}
            >
              <span className="text-xl mr-2">{category.icon}</span>
              <span className={`text-sm ${selectedCategory === category.id ? 'text-white' : 'text-slate-400'}`}>
                {category.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Tips List */}
        <div className="mt-4 space-y-3">
          {safetyTips.map((tip, index) => (
            <motion.div
              key={tip}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => markTipAsRead(tip)}
              className={`bg-slate-800/50 rounded-xl p-4 border transition-all cursor-pointer ${
                readTips.includes(tip)
                  ? 'border-green-500/30'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  readTips.includes(tip) ? 'bg-green-500' : 'bg-slate-700'
                }`}>
                  {readTips.includes(tip) ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-slate-400 text-xs">{index + 1}</span>
                  )}
                </div>
                <p className={`text-sm ${readTips.includes(tip) ? 'text-slate-400' : 'text-white'}`}>
                  {tip}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Evacuation Guide */}
      <section className="px-4 mt-6 pb-4">
        <h2 className="text-white font-semibold text-lg mb-3">Evacuation Guide</h2>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-500/20 p-2 rounded-xl">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">What to Bring</h3>
              <p className="text-slate-400 text-xs">Essential items for evacuation</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              'ID & Documents',
              'Medications',
              'Phone & Charger',
              'Water & Snacks',
              'Clothing',
              'Cash',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                <span className="text-slate-300 text-sm">{item}</span>
              </div>
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/map')}
            className="w-full mt-4 bg-amber-500/20 border border-amber-500/30 rounded-xl p-3 flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Find Nearest Evacuation Route</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </motion.button>
        </div>
      </section>
    </div>
  );
}
