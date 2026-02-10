import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getApiUrl = () => {
  if (Constants.expoConfig?.extra?.apiUrl) {
    return Constants.expoConfig.extra.apiUrl;
  }
  
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8080/api';
    }
    if (Platform.OS === 'ios') {
      return 'http://localhost:8080/api';
    }
  }
  
  return 'http://10.0.2.2:8080/api';
};

const API_URL = getApiUrl();

console.log('API_URL configurada:', API_URL);

// Utility para hacer requests HTTP usando Fetch API nativa de React Native
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(method, path, data = null) {
    const url = this.baseURL + path;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const responseData = await response.json().catch(() => null);
      
      if (!response.ok) {
        const error = new Error(responseData?.message || `HTTP ${response.status}`);
        error.response = { 
          status: response.status, 
          data: responseData || {} 
        };
        throw error;
      }
      
      // Retornar en formato compatible con Axios
      return {
        status: response.status,
        data: responseData,
        headers: response.headers,
      };
    } catch (error) {
      if (!error.response) {
        error.response = { status: 0, data: {} };
      }
      throw error;
    }
  }

  get(path) {
    return this.request('GET', path);
  }

  post(path, data) {
    return this.request('POST', path, data);
  }

  put(path, data) {
    return this.request('PUT', path, data);
  }

  delete(path) {
    return this.request('DELETE', path);
  }
}

const api = new ApiClient(API_URL);

export { API_URL };
export default api;
