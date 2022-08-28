import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ApiCore } from "../../config/api";
var baseURL = ApiCore.BASE_URL + ApiCore.API
const ApiService = axios.create({ baseURL })
ApiService.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      const headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json,*',
        Accept: 'application/json'
      }
      config.headers = headers
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
ApiService.interceptors.response.use(
  async (response) => {
    AsyncStorage.setItem('token', response.data.token);
    return response;
  }
)
export default ApiService