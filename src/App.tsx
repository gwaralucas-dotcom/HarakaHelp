import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext, useContext, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import ReportFloodPage from './pages/ReportFloodPage';
import EmergencyPage from './pages/EmergencyPage';
import AlertsPage from './pages/AlertsPage';
import MapPage from './pages/MapPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import './index.css';

// Emergency Context for global state
interface EmergencyContextType {
  activeAlert: string | null;
  setActiveAlert: (alert: string | null) => void;
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
  emergencyRequests: any[];
  addEmergencyRequest: (req: any) => void;
  floodReports: any[];
  addFloodReport: (report: any) => void;
}

const EmergencyContext = createContext<EmergencyContextType | null>(null);

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) throw new Error('useEmergency must be used within EmergencyProvider');
  return context;
};

function App() {
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [emergencyRequests, setEmergencyRequests] = useState<any[]>([]);
  const [floodReports, setFloodReports] = useState<any[]>([]);

  // Load initial data from localStorage
  useEffect(() => {
    const storedFloodReports = localStorage.getItem('emergency_flood_reports');
    const storedEmergencyRequests = localStorage.getItem('emergency_requests');
    const storedAlerts = localStorage.getItem('emergency_alerts');
    
    if (storedFloodReports) {
      setFloodReports(JSON.parse(storedFloodReports));
    }
    if (storedEmergencyRequests) {
      setEmergencyRequests(JSON.parse(storedEmergencyRequests));
    }
    if (storedAlerts && JSON.parse(storedAlerts).length > 0) {
      const alerts = JSON.parse(storedAlerts);
      if (alerts[0]) {
        setActiveAlert(alerts[0].message);
      }
    }
  }, []);

  const addEmergencyRequest = (req: any) => {
    const newRequests = [{ ...req, id: Date.now(), timestamp: new Date().toISOString() }, ...emergencyRequests];
    setEmergencyRequests(newRequests);
    localStorage.setItem('emergency_requests', JSON.stringify(newRequests));
  };

  const addFloodReport = (report: any) => {
    const newReports = [{ ...report, id: Date.now(), timestamp: new Date().toISOString() }, ...floodReports];
    setFloodReports(newReports);
    localStorage.setItem('emergency_flood_reports', JSON.stringify(newReports));
  };

  return (
    <EmergencyContext.Provider value={{
      activeAlert,
      setActiveAlert,
      userLocation,
      setUserLocation,
      emergencyRequests,
      addEmergencyRequest,
      floodReports,
      addFloodReport,
    }}>
      <BrowserRouter>
        <div className="min-h-dvh bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 pb-20">
          <Routes>
            {/* User App Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/report-flood" element={<ReportFloodPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/map" element={<MapPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            
            {/* Default */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </EmergencyContext.Provider>
  );
}

export default App;
