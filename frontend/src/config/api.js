// API Configuration for Firebase Functions
const isDevelopment = process.env.NODE_ENV === 'development';

// Firebase Functions URLs (production)
const FIREBASE_FUNCTIONS_BASE = 'https://us-central1-terptrace2.cloudfunctions.net';

// Local development URLs
const LOCAL_BASE = 'http://localhost:5001';

// Use Firebase Functions in production, local server in development
const API_BASE = isDevelopment ? LOCAL_BASE : FIREBASE_FUNCTIONS_BASE;

// Check if we're in production and show a message about Firebase Functions
const showFirebaseMessage = () => {
  if (!isDevelopment) {
    console.log('🔥 Using Firebase Functions for API calls');
    console.log('📝 Note: Some features may be in basic mode until full deployment');
  }
};

export const API_ENDPOINTS = {
  // Test endpoint
  test: `${API_BASE}/test`,
  
  // S3 URL generation
  generateUrl: (folder) => `${API_BASE}/generateUrl?folder=${folder}`,
  
  // Item management
  saveLostSomething: `${API_BASE}/saveLostSomething`,
  saveFoundSomething: `${API_BASE}/saveFoundSomething`,
  setFoundItemMatch: `${API_BASE}/setFoundItemMatch`,
  
  // User management
  register: `${API_BASE}/register`,
  getUserItems: (userId) => `${API_BASE}/getUserItems?userId=${userId}`,
};

// Initialize
showFirebaseMessage();

export default API_ENDPOINTS; 