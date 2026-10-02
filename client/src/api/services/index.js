import apiClient from '../client';

// Auth Services
export const authService = {
  login: async (credentials) => apiClient.post('/auth/login', credentials),
  register: async (data) => apiClient.post('/auth/register', data),
};

// Eligibility Services
export const eligibilityService = {
  check: async (profileData) => apiClient.post('/eligibility/check', profileData),
  getSchemes: async () => apiClient.get('/schemes'),
};

// Income Services
export const incomeService = {
  getIncome: async () => apiClient.get('/income'),
  addIncome: async (data) => apiClient.post('/income', data),
};

// Profile Services
export const profileService = {
  getProfile: async () => apiClient.get('/profile'),
  updateProfile: async (data) => apiClient.put('/profile', data),
};

// Documents Services
export const documentsService = {
  getDocuments: async () => apiClient.get('/documents'),
};

// Literacy Services
export const literacyService = {
  getModules: async () => apiClient.get('/literacy/modules'),
  getChunks: async (params) => apiClient.get('/literacy/chunks', { params }),
};

// Voice Services
export const voiceService = {
  processAudio: async (audioBlob) => {
    // Stub for Bhashini API integration
    const formData = new FormData();
    formData.append('audio', audioBlob);
    return apiClient.post('/voice/process', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
