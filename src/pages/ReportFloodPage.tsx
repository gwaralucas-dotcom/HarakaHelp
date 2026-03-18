import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Waves, 
  MapPin, 
  Camera, 
  ChevronLeft,
  CheckCircle,
  AlertTriangle,
  Droplets,
  Home,
  Car,
  TreePine
} from 'lucide-react';
import { useEmergency } from '../App';

const severityLevels = [
  { value: 'low', label: 'Low', color: 'bg-green-500', desc: 'Minor flooding' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-500', desc: 'Rising water' },
  { value: 'high', label: 'High', color: 'bg-red-500', desc: 'Severe flooding' },
  { value: 'critical', label: 'Critical', color: 'bg-purple-500', desc: 'Life-threatening' },
];

const damageTypes = [
  { icon: Home, label: 'Property', id: 'property' },
  { icon: Car, label: 'Vehicle', id: 'vehicle' },
  { icon: TreePine, label: 'Infrastructure', id: 'infrastructure' },
  { icon: Droplets, label: 'Water Supply', id: 'water' },
];

export default function ReportFloodPage() {
  const navigate = useNavigate();
  const { addFloodReport, userLocation } = useEmergency();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    severity: '',
    location: '',
    description: '',
    damageTypes: [] as string[],
    waterLevel: '',
    photos: [] as string[],
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    addFloodReport({
      ...formData,
      location: userLocation || { lat: 0, lng: 0 },
    });
    setSubmitted(true);
  };

  const toggleDamageType = (id: string) => {
    setFormData(prev => ({
      ...prev,
      damageTypes: prev.damageTypes.includes(id)
        ? prev.damageTypes.filter(d => d !== id)
        : [...prev.damageTypes, id]
    }));
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
        <h2 className="text-2xl font-bold text-white mb-2">Report Submitted!</h2>
        <p className="text-slate-400 text-center mb-8">
          Thank you for reporting. Emergency teams have been notified and will respond shortly.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setStep(1);
            setFormData({ severity: '', location: '', description: '', damageTypes: [], waterLevel: '', photos: [] });
          }}
          className="bg-red-500 text-white px-8 py-3 rounded-xl font-semibold"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

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
            <h1 className="text-xl font-bold text-white">Report Flood</h1>
            <p className="text-slate-400 text-xs">Help others stay informed</p>
          </div>
        </div>
      </header>

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
        <p className="text-slate-400 text-xs mt-2">Step {step} of 3</p>
      </div>

      {/* Step 1: Severity */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-4 mt-6"
        >
          <h2 className="text-white font-semibold text-lg mb-4">Flood Severity</h2>
          <div className="space-y-3">
            {severityLevels.map((severity) => (
              <motion.button
                key={severity.value}
                onClick={() => setFormData(prev => ({ ...prev, severity: severity.value }))}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  formData.severity === severity.value
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-slate-700 bg-slate-800/50'
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${severity.color} ${formData.severity === severity.value ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-slate-900' : ''}`} />
                <div className="flex-1 text-left">
                  <p className="text-white font-medium">{severity.label}</p>
                  <p className="text-slate-400 text-xs">{severity.desc}</p>
                </div>
                {formData.severity === severity.value && (
                  <CheckCircle className="w-5 h-5 text-red-500" />
                )}
              </motion.button>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!formData.severity}
            className="w-full mt-6 bg-red-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </motion.div>
      )}

      {/* Step 2: Location & Details */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-4 mt-6 space-y-4"
        >
          <h2 className="text-white font-semibold text-lg mb-4">Location & Details</h2>
          
          {/* Current Location */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Your Location</span>
            </div>
            <p className="text-slate-400 text-sm">
              {userLocation 
                ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                : 'Locating...'}
            </p>
          </div>

          {/* Water Level */}
          <div>
            <label className="text-white font-medium block mb-2">Water Level (approximate)</label>
            <input
              type="text"
              placeholder="e.g., 1 foot, knee-deep, waist-high"
              value={formData.waterLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, waterLevel: e.target.value }))}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500"
            />
          </div>

          {/* Damage Types */}
          <div>
            <label className="text-white font-medium block mb-3">Affected Areas</label>
            <div className="grid grid-cols-2 gap-3">
              {damageTypes.map((damage) => (
                <motion.button
                  key={damage.id}
                  onClick={() => toggleDamageType(damage.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    formData.damageTypes.includes(damage.id)
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-slate-700 bg-slate-800/50'
                  }`}
                >
                  <damage.icon className={`w-6 h-6 ${formData.damageTypes.includes(damage.id) ? 'text-red-400' : 'text-slate-400'}`} />
                  <span className={`text-sm ${formData.damageTypes.includes(damage.id) ? 'text-white' : 'text-slate-400'}`}>
                    {damage.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-white font-medium block mb-2">Additional Details</label>
            <textarea
              placeholder="Describe the situation..."
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

      {/* Step 3: Photo & Submit */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-4 mt-6"
        >
          <h2 className="text-white font-semibold text-lg mb-4">Add Photo (Optional)</h2>
          
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center mb-6">
            <Camera className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400 mb-2">Tap to add a photo</p>
            <p className="text-slate-500 text-xs">Help emergency teams assess the situation</p>
          </div>

          {/* Summary */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-6">
            <h3 className="text-white font-medium mb-3">Report Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Severity:</span>
                <span className="text-white capitalize">{formData.severity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Water Level:</span>
                <span className="text-white">{formData.waterLevel || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Damage Types:</span>
                <span className="text-white">{formData.damageTypes.length > 0 ? formData.damageTypes.join(', ') : 'None'}</span>
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
              className="flex-1 bg-green-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              Submit Report
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
