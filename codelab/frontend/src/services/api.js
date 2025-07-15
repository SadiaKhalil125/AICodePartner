import axios from 'axios';
import { 
  API_ENDPOINTS, 
  validateCodeSubmission, 
  formatTestResult, 
  formatProblemData 
} from '../types/api.js';

// ===== API Configuration =====
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== Request Interceptor =====
apiClient.interceptors.request.use(
  (config) => {
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ===== Response Interceptor =====
apiClient.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime;
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, response.data);
    return response;
  },
  (error) => {
    const duration = error.config?.metadata ? new Date() - error.config.metadata.startTime : 0;
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Transform error for consistent handling
    const apiError = {
      message: error.response?.data?.detail || error.response?.data?.message || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      isNetworkError: !error.response,
      isTimeout: error.code === 'ECONNABORTED'
    };
    
    return Promise.reject(apiError);
  }
);

// ===== API Service Class =====
class APIService {
  
  // ===== Problem Related Methods =====
  async generateProblem(problemRequest) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.GENERATE_PROBLEM, problemRequest);
      return {
        success: true,
        data: formatProblemData(response.data),
        message: 'Problem generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  // ===== Code Execution Methods =====
  async runCode(codeSubmission) {
    try {
      // Validate submission before sending
      if (!validateCodeSubmission(codeSubmission)) {
        throw new Error('Invalid code submission data');
      }

      const response = await apiClient.post(API_ENDPOINTS.RUN_CODE, codeSubmission);
      const results = response.data.results || [];
      
      return {
        success: true,
        data: {
          results: results.map(formatTestResult),
          passed: Boolean(response.data.passed),
          failed: response.data.failed || null,
          totalTests: results.length,
          passedTests: results.filter(r => r.passed).length
        },
        message: response.data.passed ? 'All tests passed!' : `Failed at test case ${response.data.failed}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  async submitCode(codeSubmission) {
    try {
      // Validate submission before sending
      if (!validateCodeSubmission(codeSubmission)) {
        throw new Error('Invalid code submission data');
      }

      const response = await apiClient.post(API_ENDPOINTS.SUBMIT_CODE, codeSubmission);
      const results = response.data.results || [];
      
      return {
        success: true,
        data: {
          results: results.map(formatTestResult),
          passed: Boolean(response.data.passed),
          failed: response.data.failed || null,
          totalTests: results.length,
          passedTests: results.filter(r => r.passed).length
        },
        message: response.data.passed ? 'Solution submitted successfully!' : `Failed at test case ${response.data.failed}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  async getSuggestions(codeSubmission) {
    try {
      if (!validateCodeSubmission(codeSubmission)) {
        throw new Error('Invalid code submission data');
      }

      const response = await apiClient.post(API_ENDPOINTS.GET_SUGGESTIONS, codeSubmission);
      
      return {
        success: true,
        data: {
          suggestions: response.data.suggestions || 'No suggestions available'
        },
        message: 'Suggestions generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  // ===== User Related Methods =====
  async createUser(userData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CREATE_USER, userData);
      return {
        success: true,
        data: response.data,
        message: 'User created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  async validateUser(userData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.VALIDATE_USER, userData);
      return {
        success: true,
        data: response.data,
        message: 'User validated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  async getUserById(userId) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.GET_USER_BY_ID, { user_id: userId });
      return {
        success: true,
        data: response.data,
        message: 'User retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  async getUserByEmail(email) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.GET_USER_BY_EMAIL, { email });
      return {
        success: true,
        data: response.data,
        message: 'User retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  // ===== Statistics Methods =====
  async createStatistics(email) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CREATE_STATISTICS, { email });
      return {
        success: true,
        data: response.data,
        message: 'Statistics created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  async getStatistics(email) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.GET_STATISTICS, { email });
      return {
        success: true,
        data: response.data,
        message: 'Statistics retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  // ===== Language Methods =====
  async getLanguages() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_LANGUAGES);
      return {
        success: true,
        data: response.data,
        message: 'Languages retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  // ===== Info Methods =====
  async getInfo() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_INFO);
      return {
        success: true,
        data: response.data,
        message: 'Info retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  // ===== Health Check =====
  async healthCheck() {
    try {
      const response = await apiClient.get('/health', { timeout: 5000 });
      return {
        success: true,
        data: response.data,
        message: 'Backend is healthy'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }
}

// ===== Export singleton instance =====
export const apiService = new APIService();
export default apiService;

// ===== Export axios instance for custom usage =====
export { apiClient };

// ===== Utility Functions =====
export const isAPIError = (error) => {
  return error && typeof error === 'object' && 'message' in error;
};

export const getErrorMessage = (error) => {
  if (isAPIError(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

export const isNetworkError = (error) => {
  return isAPIError(error) && error.isNetworkError;
};

export const isTimeoutError = (error) => {
  return isAPIError(error) && error.isTimeout;
}; 