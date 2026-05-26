import axios, { type AxiosInstance } from 'axios';
import { getActiveCredentials, invalidateCredentials } from './auth.service.js';
import { AppError } from '../middleware/errorHandler.js';

const BASE_URL = 'https://ec.95306.cn';

export function create95306Client(): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 30_000,
    headers: {
      Origin: BASE_URL,
      Referer: `${BASE_URL}/stateTrack/cargoTrack`,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
      type: 'outer',
      channel: 'P',
    },
  });

  client.interceptors.request.use((config) => {
    const creds = getActiveCredentials();
    if (!creds) throw new AppError(401, '95306 credentials not configured');
    config.headers['access_token'] = creds.access_token;
    config.headers['userid'] = creds.userid;
    config.headers['username'] = creds.username;
    config.headers['unitid'] = creds.unitid;
    config.headers['unitname'] = creds.unitname;
    config.headers['bureauid'] = creds.bureauid;
    config.headers['bureaudm'] = creds.bureaudm;
    config.headers['usertype'] = creds.usertype;
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response?.status === 401) {
        invalidateCredentials();
      }
      const message = error.response?.data?.msg || error.message || '95306 API error';
      return Promise.reject(new AppError(error.response?.status || 502, message));
    },
  );

  return client;
}
