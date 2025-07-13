import { useEffect } from 'react';
import axios from 'axios';
import useAuth from './useAuth';

const axiosSecure = axios.create({
  baseURL: 'http://localhost:3000',
});

const useAxiosSecure = () => {
  const { user } = useAuth();

  useEffect(() => {
    let requestInterceptor;

    const setInterceptor = async () => {
      requestInterceptor = axiosSecure.interceptors.request.use(
        async (config) => {
          if (user) {
            const token = await user.getIdToken();
            // console.log(`Token: ${token}`);
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );
    };

    setInterceptor();

    // Clean up interceptor on unmount or when user changes
    return () => {
      if (requestInterceptor) {
        axiosSecure.interceptors.request.eject(requestInterceptor);
      }
    };
  }, [user]);

  return axiosSecure;
};

export default useAxiosSecure;
