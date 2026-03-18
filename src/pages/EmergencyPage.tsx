import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Siren, 
  MapPin, 
  ChevronLeft,
  CheckCircle,
  Phone,
  Users,
  Heart,
  Car,
  Building,
  AlertTriangle
} from 'lucide-react';
import { useEmergency } from '../App';

const emergencyTypes = [
  { 
    id: 'rescue', 
    icon: Car, 
    label: 'Rescue', 
    desc: 'Trapped or stranded',
    color: 'from-orange-500 to-red-500'
  },
  { 
    id: 'medical', 
    icon: Heart, 
    label: 'Medical', 
    desc: 'Injury or illness',
    color: 'from-red-500 to-pink-500'
  },
  { 
    id: 'evacuation', 
    icon: Users, 
    label: 'Evacuation', 
    desc: 'Need transport',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'shelter', 
    icon: Building, 
    label: 'Shelter', 
    desc: 'Need safe housing',
    color: 'from-green-500 to-emerald-500'
  },
];

const peopleCount = ['1', '2', '3', '4', '5', '6+'];

export default function EmergencyPage() {
  const navigate = useNavigate();
  const { addEmergencyRequest, userLocation } = useEmergency();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    emergencyType: '',
    peopleCount: '',
    description: '',
    name: '',
    phone: '',
    accessible: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    setSending(true);
    // Simulate sending request
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    addEmergencyRequest({
      ...formData,
      location: userLocation,
    });
    
    setSending(false);
    setSubmitted(true);
  };

  const callEmergency = () => {
    window.location.href = 'tel:911';
  };

  if (submitted) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Request Sent!</h2>
        <p className="text-slate-400 text-center mb-2">
          Rescue teams have been dispatched to your location.
        </p>
        <p className="text-red-400 text-sm mb-8">
          Stay calm. Help is on the way.
        </p>
        
        <div className="bg-slate-800/50 rounded-xl p-4 w-full mb-6">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">Your Location</span>
          </div>
          <p className="text-slate-400 text-sm">
            {userLocation 
              ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
              : 'Location shared'}
          </p>
        </div>

        <button
          onClick={callEmergency}
          className="w-full bg-green-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 mb-4"
        >
          <Phone className="w-5 h-5" />
          Call Emergency (911)
        </button>

        <button
          onClick={() => {
            setSubmitted(false);
            setStep(1);
            setFormData({ emergencyType: '', peopleCount: '', description: '', name: '', phone: '', accessible: false });
          }}
          className="text-slate-400 text-sm"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh pb-4">
      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 p-4 pt-6" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="bg-white/20 p-2 rounded-xl"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Emergency Request</h1>
              <p className="text-white/80 text-xs">We'll send help immediately</p>
            </div>
          </div>
          <button
            onClick={callEmergency}
            className="bg-white text-red-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            911
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 mt-4">
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-red-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Emergency Type */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-4 mt-6"
          >
            <h2 className="text-white font-semibold text-lg mb-4">What type of emergency?</h2>
            <div className="grid grid-cols-2 gap-3">
              {emergencyTypes.map((type) => (
                <motion.button
                  key={type.id}
                  onClick={() => setFormData(prev => ({ ...prev, emergencyType: type.id }))}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    formData.emergencyType === type.id
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-slate-700 bg-slate-800/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                    <type.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white font-medium">{type.label}</span>
                  <span className="text-slate-400 text-xs">{type.desc}</span>
                </motion.button>
              ))}
            </div>

            {/* People Count */}
            {formData.emergencyType && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6"
              >
                <h3 className="text-white font-medium mb-3">How many people need help?</h3>
                <div className="flex gap-2 flex-wrap">
                  {peopleCount.map((count) => (
                    <motion.button
                      key={count}
                      onClick={() => setFormData(prev => ({ ...prev, peopleCount: count }))}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl border-2 transition-all ${
                        formData.peopleCount === count
                          ? 'border-red-500 bg-red-500/10 text-white'
                          : 'border-slate-700 bg-slate-800/50 text-slate-400'
                      }`}
                    >
                      {count}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!formData.emergencyType || !formData.peopleCount}
              className="w-full mt-6 bg-red-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-4 mt-6 space-y-4"
          >
            <h2 className="text-white font-semibold text-lg mb-4">Situation Details</h2>

            {/* Location */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Your Location</span>
              </div>
              <p className="text-slate-400 text-sm">
                {userLocation 
                  ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                  : 'Will be shared with rescue team'}
              </p>
            </div>

            {/* Accessibility */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.accessible}
                  onChange={(e) => setFormData(prev => ({ ...prev, accessible: e.target.checked }))}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-red-500 focus:ring-red-500"
                />
                <span className="text-white">Anyone requires wheelchair accessibility?</span>
              </label>
            </div>

            {/* Description */}
            <div>
              <label className="text-white font-medium block mb-2">Describe your situation</label>
              <textarea
                placeholder="e.g., trapped on roof, elderly person needs medical attention..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 h-24 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-slate-700 text-white py-4 rounded-xl font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-red-500 text-white py-4 rounded-xl font-semibold"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Contact & Submit */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-4 mt-6 space-y-4"
          >
            <h2 className="text-white font-semibold text-lg mb-4">Contact Information</h2>

            <div>
              <label className="text-white font-medium block mb-2">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="text-white font-medium block mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500"
              />
            </div>

            {/* Warning */}
            <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-400 font-medium text-sm">Important</p>
                <p className="text-slate-400 text-xs">
                  Stay on the line if possible. Keep your phone accessible for rescue teams to contact you.
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="text-white font-medium mb-3">Request Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Emergency:</span>
                  <span className="text-white capitalize">{formData.emergencyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">People:</span>
                  <span className="text-white">{formData.peopleCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Accessible:</span>
                  <span className="text-white">{formData.accessible ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-slate-700 text-white py-4 rounded-xl font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={sending}
                className="flex-1 bg-red-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {sending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <Siren className="w-5 h-5" />
                    Send Request
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
