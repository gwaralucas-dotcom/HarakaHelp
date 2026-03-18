import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Siren, 
  MapPin, 
  Shield,
  LogOut,
  TrendingUp,
  Users,
  Clock,
  ChevronRight,
  Trash2,
  Plus,
  Edit,
  X,
  Check
} from 'lucide-react';
import { 
  getStats, 
  getFloodReports, 
  getEmergencyRequests, 
  getAlerts, 
  getShelters,
  getSafetyTips,
  deleteAlert,
  deleteShelter,
  addAlert,
  addShelter,
  updateAlert,
  updateShelter,
  clearFloodReports,
  clearEmergencyRequests,
  adminLogout,
  isAdminLoggedIn
} from '../../utils/storage';

type TabType = 'dashboard' | 'reports' | 'requests' | 'alerts' | 'shelters' | 'tips';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [stats, setStats] = useState(getStats());
  const [floodReports, setFloodReports] = useState(getFloodReports());
  const [emergencyRequests, setEmergencyRequests] = useState(getEmergencyRequests());
  const [alerts, setAlerts] = useState(getAlerts());
  const [shelters, setShelters] = useState(getShelters());
  const [safetyTips, setSafetyTips] = useState(getSafetyTips());
  
  // Modal states
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showShelterModal, setShowShelterModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState<any>(null);
  const [editingShelter, setEditingShelter] = useState<any>(null);
  
  // Form states
  const [alertForm, setAlertForm] = useState({ title: '', message: '', type: 'flood', severity: 'high', location: '' });
  const [shelterForm, setShelterForm] = useState({ name: '', address: '', type: 'shelter', capacity: '', open: true });

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin');
    }
  }, [navigate]);

  const refreshData = () => {
    setStats(getStats());
    setFloodReports(getFloodReports());
    setEmergencyRequests(getEmergencyRequests());
    setAlerts(getAlerts());
    setShelters(getShelters());
    setSafetyTips(getSafetyTips());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    adminLogout();
    navigate('/');
  };

  const handleDeleteAlert = (id: number) => {
    deleteAlert(id);
    refreshData();
  };

  const handleDeleteShelter = (id: number) => {
    deleteShelter(id);
    refreshData();
  };

  const handleSaveAlert = () => {
    if (editingAlert) {
      updateAlert(editingAlert.id, alertForm);
    } else {
      addAlert(alertForm);
    }
    setShowAlertModal(false);
    setEditingAlert(null);
    setAlertForm({ title: '', message: '', type: 'flood', severity: 'high', location: '' });
    refreshData();
  };

  const handleSaveShelter = () => {
    if (editingShelter) {
      updateShelter(editingShelter.id, shelterForm);
    } else {
      addShelter({ ...shelterForm, distance: '0.1 mi' });
    }
    setShowShelterModal(false);
    setEditingShelter(null);
    setShelterForm({ name: '', address: '', type: 'shelter', capacity: '', open: true });
    refreshData();
  };

  const openEditAlert = (alert: any) => {
    setEditingAlert(alert);
    setAlertForm({ title: alert.title, message: alert.message, type: alert.type, severity: alert.severity, location: alert.location });
    setShowAlertModal(true);
  };

  const openEditShelter = (shelter: any) => {
    setEditingShelter(shelter);
    setShelterForm({ name: shelter.name, address: shelter.address, type: shelter.type, capacity: shelter.capacity, open: shelter.open });
    setShowShelterModal(true);
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all reports and requests?')) {
      clearFloodReports();
      clearEmergencyRequests();
      refreshData();
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reports', label: 'Flood Reports', icon: AlertTriangle },
    { id: 'requests', label: 'Emergency Requests', icon: Siren },
    { id: 'alerts', label: 'Alerts CMS', icon: Bell },
    { id: 'shelters', label: 'Shelters CMS', icon: MapPin },
    { id: 'tips', label: 'Safety Tips', icon: Shield },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-purple-500';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="min-h-dvh bg-slate-900" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold">Admin Dashboard</h1>
              <p className="text-slate-400 text-xs">Emergency Response System</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-slate-700 px-4 py-2 rounded-xl flex items-center gap-2 text-slate-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-slate-800 border-b border-slate-700 overflow-x-auto">
        <div className="flex gap-1 p-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-red-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Flood Reports</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.totalReports}</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-red-500/20 p-2 rounded-lg">
                    <Siren className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Emergency Requests</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.totalRequests}</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Critical Reports</span>
                </div>
                <p className="text-2xl font-bold text-purple-400">{stats.criticalReports}</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Active Shelters</span>
                </div>
                <p className="text-2xl font-bold text-green-400">{shelters.length}</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h2 className="text-white font-semibold">Recent Activity</h2>
                <button onClick={clearAllData} className="text-red-400 text-sm hover:underline">
                  Clear All Data
                </button>
              </div>
              <div className="divide-y divide-slate-700">
                {[...floodReports.slice(0, 3), ...emergencyRequests.slice(0, 3)].slice(0, 5).map((item: any, idx: number) => (
                  <div key={idx} className="p-4 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.severity ? getSeverityColor(item.severity) : 'bg-red-500'}`} />
                    <div className="flex-1">
                      <p className="text-white text-sm">{item.severity ? `Flood Report: ${item.severity}` : `Emergency: ${item.emergencyType}`}</p>
                      <p className="text-slate-400 text-xs">{new Date(item.timestamp).toLocaleString()}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
                {floodReports.length === 0 && emergencyRequests.length === 0 && (
                  <div className="p-8 text-center text-slate-500">No recent activity</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Flood Reports Tab */}
        {activeTab === 'reports' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-white font-semibold mb-4">All Flood Reports ({floodReports.length})</h2>
            <div className="space-y-3">
              {floodReports.map((report: any) => (
                <div key={report.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getSeverityColor(report.severity)} text-white`}>
                        {report.severity?.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {new Date(report.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-400">Water Level:</span>
                      <span className="text-white ml-2">{report.waterLevel || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Damage Types:</span>
                      <span className="text-white ml-2">{report.damageTypes?.join(', ') || 'None'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400">Description:</span>
                      <span className="text-white ml-2">{report.description || 'No description'}</span>
                    </div>
                  </div>
                </div>
              ))}
              {floodReports.length === 0 && (
                <div className="text-center text-slate-500 py-8">No flood reports yet</div>
              )}
            </div>
          </motion.div>
        )}

        {/* Emergency Requests Tab */}
        {activeTab === 'requests' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-white font-semibold mb-4">All Emergency Requests ({emergencyRequests.length})</h2>
            <div className="space-y-3">
              {emergencyRequests.map((request: any) => (
                <div key={request.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-red-500 text-white">
                        {request.emergencyType?.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {new Date(request.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-400">People:</span>
                      <span className="text-white ml-2">{request.peopleCount}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Accessible:</span>
                      <span className="text-white ml-2">{request.accessible ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Name:</span>
                      <span className="text-white ml-2">{request.name || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Phone:</span>
                      <span className="text-white ml-2">{request.phone || 'Not provided'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400">Description:</span>
                      <span className="text-white ml-2">{request.description || 'No description'}</span>
                    </div>
                  </div>
                </div>
              ))}
              {emergencyRequests.length === 0 && (
                <div className="text-center text-slate-500 py-8">No emergency requests yet</div>
              )}
            </div>
          </motion.div>
        )}

        {/* Alerts CMS Tab */}
        {activeTab === 'alerts' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-semibold">Manage Alerts ({alerts.length})</h2>
              <button
                onClick={() => { setEditingAlert(null); setAlertForm({ title: '', message: '', type: 'flood', severity: 'high', location: '' }); setShowAlertModal(true); }}
                className="bg-red-500 px-4 py-2 rounded-xl flex items-center gap-2 text-white text-sm"
              >
                <Plus className="w-4 h-4" /> Add Alert
              </button>
            </div>
            <div className="space-y-3">
              {alerts.map((alert: any) => (
                <div key={alert.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getSeverityColor(alert.severity)} text-white`}>
                        {alert.severity}
                      </span>
                      <span className="text-slate-400 text-xs">{alert.type}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditAlert(alert)} className="text-blue-400 hover:text-blue-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteAlert(alert.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-white font-medium">{alert.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{alert.message}</p>
                  <p className="text-slate-500 text-xs mt-2">{alert.location} • {alert.time}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Shelters CMS Tab */}
        {activeTab === 'shelters' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-semibold">Manage Shelters ({shelters.length})</h2>
              <button
                onClick={() => { setEditingShelter(null); setShelterForm({ name: '', address: '', type: 'shelter', capacity: '', open: true }); setShowShelterModal(true); }}
                className="bg-red-500 px-4 py-2 rounded-xl flex items-center gap-2 text-white text-sm"
              >
                <Plus className="w-4 h-4" /> Add Shelter
              </button>
            </div>
            <div className="space-y-3">
              {shelters.map((shelter: any) => (
                <div key={shelter.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        shelter.type === 'shelter' ? 'bg-green-500' : shelter.type === 'hospital' ? 'bg-red-500' : 'bg-blue-500'
                      } text-white`}>
                        {shelter.type}
                      </span>
                      <span className={`text-xs ${shelter.open ? 'text-green-400' : 'text-red-400'}`}>
                        {shelter.open ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditShelter(shelter)} className="text-blue-400 hover:text-blue-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteShelter(shelter.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-white font-medium">{shelter.name}</h3>
                  <p className="text-slate-400 text-sm">{shelter.address}</p>
                  <p className="text-slate-500 text-xs mt-1">Capacity: {shelter.capacity}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Safety Tips Tab */}
        {activeTab === 'tips' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-white font-semibold mb-4">Safety Tips Management</h2>
            <div className="space-y-6">
              {Object.entries(safetyTips).map(([category, tips]: [string, any]) => (
                <div key={category} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-medium capitalize mb-3">{category} Safety Tips</h3>
                  <div className="space-y-2">
                    {tips.map((tip: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                        <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs">{idx + 1}</span>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowAlertModal(false)}>
          <motion.div 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }}
            className="bg-slate-800 rounded-2xl p-6 w-full max-w-md" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-semibold">{editingAlert ? 'Edit Alert' : 'Add New Alert'}</h2>
              <button onClick={() => setShowAlertModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Alert Title"
                value={alertForm.title}
                onChange={e => setAlertForm({ ...alertForm, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
              />
              <textarea
                placeholder="Alert Message"
                value={alertForm.message}
                onChange={e => setAlertForm({ ...alertForm, message: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white h-24"
              />
              <input
                type="text"
                placeholder="Location"
                value={alertForm.location}
                onChange={e => setAlertForm({ ...alertForm, location: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={alertForm.type}
                  onChange={e => setAlertForm({ ...alertForm, type: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                >
                  <option value="flood">Flood</option>
                  <option value="evacuation">Evacuation</option>
                  <option value="weather">Weather</option>
                  <option value="shelter">Shelter</option>
                </select>
                <select
                  value={alertForm.severity}
                  onChange={e => setAlertForm({ ...alertForm, severity: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <button
                onClick={handleSaveAlert}
                className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                {editingAlert ? 'Update Alert' : 'Add Alert'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Shelter Modal */}
      {showShelterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowShelterModal(false)}>
          <motion.div 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }}
            className="bg-slate-800 rounded-2xl p-6 w-full max-w-md" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-semibold">{editingShelter ? 'Edit Shelter' : 'Add New Shelter'}</h2>
              <button onClick={() => setShowShelterModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Shelter Name"
                value={shelterForm.name}
                onChange={e => setShelterForm({ ...shelterForm, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
              />
              <input
                type="text"
                placeholder="Address"
                value={shelterForm.address}
                onChange={e => setShelterForm({ ...shelterForm, address: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
              />
              <input
                type="text"
                placeholder="Capacity (e.g., 100/150)"
                value={shelterForm.capacity}
                onChange={e => setShelterForm({ ...shelterForm, capacity: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={shelterForm.type}
                  onChange={e => setShelterForm({ ...shelterForm, type: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                >
                  <option value="shelter">Shelter</option>
                  <option value="hospital">Hospital</option>
                  <option value="relief">Relief Center</option>
                </select>
                <label className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-3">
                  <input
                    type="checkbox"
                    checked={shelterForm.open}
                    onChange={e => setShelterForm({ ...shelterForm, open: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-white">Open</span>
                </label>
              </div>
              <button
                onClick={handleSaveShelter}
                className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                {editingShelter ? 'Update Shelter' : 'Add Shelter'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function Bell({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
