import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AxiosInstance = axios.create({
  // baseURL: 'http://10.0.2.2:4000/',
  baseURL: 'http://134.190.131.33:4000/',
  // baseURL: 'http://127.0.0.1:4000/',
});

AxiosInstance.interceptors.request.use(async request => {
  if (request.url.endsWith('login')) return request;

  if (request.url.endsWith('register')) return request;
  if (request.url.endsWith('reset-password')) return request;

  const token = await AsyncStorage.getItem('token');
  request.headers.Authorization = `Bearer ${token}`;
  return request;
});

export default AxiosInstance;
