import Config from 'react-native-config';

const fallbackApiBaseUrl = __DEV__
  ? 'http://10.205.221.130:3000/api'
  : 'https://your-production-url.com/api';

export const env = {
  API_BASE_URL: Config.API_BASE_URL ?? fallbackApiBaseUrl,
};
