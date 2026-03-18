// LocalStorage Service for Admin Dashboard & CMS

const STORAGE_KEYS = {
  FLOOD_REPORTS: 'emergency_flood_reports',
  EMERGENCY_REQUESTS: 'emergency_requests',
  ALERTS: 'emergency_alerts',
  SHELTERS: 'emergency_shelters',
  SAFETY_TIPS: 'safety_tips',
  ADMIN_LOGIN: 'admin_logged_in',
};

// Default data
const defaultShelters = [
  { id: 1, name: 'Central Community Center', type: 'shelter', address: '123 Main Street', distance: '0.3 mi', capacity: '150/200', open: true, lat: 40.7148, lng: -74.008 },
  { id: 2, name: 'City General Hospital', type: 'hospital', address: '456 Medical Drive', distance: '0.8 mi', capacity: 'Open 24/7', open: true, lat: 40.7168, lng: -74.012 },
  { id: 3, name: 'Red Cross Relief Center', type: 'relief', address: '789 Aid Road', distance: '1.2 mi', capacity: '80/100', open: true, lat: 40.7188, lng: -74.015 },
  { id: 4, name: 'High School Emergency Shelter', type: 'shelter', address: '321 Education Blvd', distance: '1.5 mi', capacity: '200/300', open: true, lat: 40.7208, lng: -74.018 },
  { id: 5, name: 'St. Marys Hospital', type: 'hospital', address: '555 Health Street', distance: '2.0 mi', capacity: 'Open 24/7', open: true, lat: 40.7228, lng: -74.020 },
  { id: 6, name: 'National Guard Post', type: 'relief', address: '888 Military Road', distance: '2.5 mi', capacity: '500/500', open: true, lat: 40.7248, lng: -74.022 },
];

const defaultAlerts = [
  { id: 1, type: 'flood', title: 'Flash Flood Warning', location: 'Downtown Area', time: '2 hours ago', severity: 'high', message: 'Flash flood warning in effect. Water levels rising rapidly. Move to higher ground immediately.' },
  { id: 2, type: 'evacuation', title: 'Evacuation Order', location: 'Riverside District', time: '1 hour ago', severity: 'critical', message: 'Mandatory evacuation for Riverside District. Proceed to nearest shelter immediately.' },
];

const defaultSafetyTips = {
  flood: ['Move to higher ground immediately', 'Do not walk or drive through flood water', 'Avoid bridges over fast-moving water', 'Keep electronics away from water', 'If trapped, go to the highest level'],
  evacuation: ['Follow official evacuation routes only', 'Take essential documents with you', 'Shut off utilities before leaving', 'Check on neighbors who may need help', 'Do not return until officially cleared'],
  weather: ['Stay indoors away from windows', 'Avoid using electrical appliances', 'Keep emergency supplies ready', 'Listen to weather updates', 'Secure outdoor furniture'],
  shelter: ['Bring bedding and medications', 'Follow shelter staff instructions', 'Keep pets in designated areas', 'Register with shelter on arrival', 'Stay connected with family members'],
};

// Generic storage helpers
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    return defaultValue;
  } catch {
    return defaultValue;
  }
};

const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

// Flood Reports
export const getFloodReports = () => getFromStorage(STORAGE_KEYS.FLOOD_REPORTS, []);
export const addFloodReport = (report: any) => {
  const reports = getFloodReports();
  const newReport = { ...report, id: Date.now(), timestamp: new Date().toISOString() };
  setToStorage(STORAGE_KEYS.FLOOD_REPORTS, [newReport, ...reports]);
  return newReport;
};
export const clearFloodReports = () => setToStorage(STORAGE_KEYS.FLOOD_REPORTS, []);

// Emergency Requests
export const getEmergencyRequests = () => getFromStorage(STORAGE_KEYS.EMERGENCY_REQUESTS, []);
export const addEmergencyRequest = (request: any) => {
  const requests = getEmergencyRequests();
  const newRequest = { ...request, id: Date.now(), timestamp: new Date().toISOString() };
  setToStorage(STORAGE_KEYS.EMERGENCY_REQUESTS, [newRequest, ...requests]);
  return newRequest;
};
export const clearEmergencyRequests = () => setToStorage(STORAGE_KEYS.EMERGENCY_REQUESTS, []);

// Alerts (CMS)
export const getAlerts = () => getFromStorage(STORAGE_KEYS.ALERTS, defaultAlerts);
export const addAlert = (alert: any) => {
  const alerts = getAlerts();
  const newAlert = { ...alert, id: Date.now(), time: 'Just now' };
  setToStorage(STORAGE_KEYS.ALERTS, [newAlert, ...alerts]);
  return newAlert;
};
export const updateAlert = (id: number, data: any) => {
  const alerts = getAlerts().map(a => a.id === id ? { ...a, ...data } : a);
  setToStorage(STORAGE_KEYS.ALERTS, alerts);
};
export const deleteAlert = (id: number) => {
  setToStorage(STORAGE_KEYS.ALERTS, getAlerts().filter(a => a.id !== id));
};

// Shelters (CMS)
export const getShelters = () => getFromStorage(STORAGE_KEYS.SHELTERS, defaultShelters);
export const addShelter = (shelter: any) => {
  const shelters = getShelters();
  const newShelter = { ...shelter, id: Date.now() };
  setToStorage(STORAGE_KEYS.SHELTERS, [...shelters, newShelter]);
  return newShelter;
};
export const updateShelter = (id: number, data: any) => {
  const shelters = getShelters().map(s => s.id === id ? { ...s, ...data } : s);
  setToStorage(STORAGE_KEYS.SHELTERS, shelters);
};
export const deleteShelter = (id: number) => {
  setToStorage(STORAGE_KEYS.SHELTERS, getShelters().filter(s => s.id !== id));
};

// Safety Tips (CMS)
export const getSafetyTips = () => getFromStorage(STORAGE_KEYS.SAFETY_TIPS, defaultSafetyTips);
export const updateSafetyTips = (tips: any) => setToStorage(STORAGE_KEYS.SAFETY_TIPS, tips);

// Admin Auth
export const isAdminLoggedIn = () => localStorage.getItem(STORAGE_KEYS.ADMIN_LOGIN) === 'true';
export const adminLogin = (password: string) => {
  if (password === 'admin123') {
    localStorage.setItem(STORAGE_KEYS.ADMIN_LOGIN, 'true');
    return true;
  }
  return false;
};
export const adminLogout = () => localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGIN);

// Stats
export const getStats = () => {
  const reports = getFloodReports();
  const requests = getEmergencyRequests();
  return {
    totalReports: reports.length,
    totalRequests: requests.length,
    criticalReports: reports.filter(r => r.severity === 'critical').length,
    highReports: reports.filter(r => r.severity === 'high').length,
    rescueRequests: requests.filter(r => r.emergencyType === 'rescue').length,
    medicalRequests: requests.filter(r => r.emergencyType === 'medical').length,
  };
};
