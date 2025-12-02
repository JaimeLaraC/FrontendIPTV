import axios from 'axios';
import { XtreamCategory, XtreamStream, Credentials, AccountInfo } from '../types';

// Use localhost for development, but this should ideally be configurable
const API_BASE_URL = 'http://localhost:3000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

export const login = async (credentials: Credentials): Promise<{ token: string, user: any }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: credentials.username,
      password: credentials.password,
      url: credentials.url
    });

    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      return response.data.data;
    }
    throw new Error(response.data.error || 'Login failed');
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message || 'Login failed');
  }
};

export const getProfile = async (): Promise<AccountInfo> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`, getAuthHeaders());
    if (response.data.success) {
      // Transform backend response to match AccountInfo interface if needed
      // The backend returns { user: { iptv_credentials: { ... } } }
      // We might need to map this to the expected AccountInfo structure if it differs
      // For now, let's assume we can get the necessary info or we might need to adjust types.ts
      // But based on types.ts, AccountInfo expects user_info and server_info.
      // The backend profile endpoint returns decrypted credentials but maybe not the full xtream user_info/server_info 
      // unless we fetch it from the xtream API via the backend.
      // Actually, the backend doesn't seem to expose a direct "get xtream profile" endpoint that returns user_info/server_info directly 
      // in the same format as the Xtream API. 
      // However, for the purpose of this task (connecting frontend/backend), let's focus on channels.
      // If we need account info, we might need to add an endpoint or use what we have.
      return response.data.data;
    }
    throw new Error('Failed to fetch profile');
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message);
  }
}

export const fetchCategories = async (url: string = '', type: string = 'get_live_categories'): Promise<XtreamCategory[]> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/live/categories`, {}, getAuthHeaders());
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchStreams = async (url: string = '', categoryId: string, type: string = 'get_live_streams'): Promise<XtreamStream[]> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/live/streams/${categoryId}`, {}, getAuthHeaders());
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching streams:', error);
    return [];
  }
};

export const fetchAllStreams = async (): Promise<XtreamStream[]> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/live/streams`, {}, getAuthHeaders());
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching all streams:', error);
    return [];
  }
};

export const getCountryFlag = (categoryName: string) => {
  // Simple mapping, can be expanded
  if (categoryName.toLowerCase().includes('ukraine')) return "🇺🇦";
  if (categoryName.toLowerCase().includes('brazil')) return "🇧🇷";
  if (categoryName.toLowerCase().includes('germany')) return "🇩🇪";
  if (categoryName.toLowerCase().includes('usa') || categoryName.toLowerCase().includes('united states')) return "🇺🇸";
  if (categoryName.toLowerCase().includes('france')) return "🇫🇷";
  if (categoryName.toLowerCase().includes('portugal')) return "🇵🇹";
  if (categoryName.toLowerCase().includes('spain')) return "🇪🇸";
  if (categoryName.toLowerCase().includes('italy')) return "🇮🇹";
  if (categoryName.toLowerCase().includes('uk') || categoryName.toLowerCase().includes('united kingdom')) return "🇬🇧";
  return "📺";
};