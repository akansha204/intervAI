import Config from 'react-native-config';

// 10.0.2.2 is the Android emulator's alias for the host machine.
// Physical devices need the host's LAN IP via API_BASE_URL in the root .env.
const fallbackApiBaseUrl = __DEV__
  ? 'http://10.0.2.2:3000/api'
  : 'https://your-production-url.com/api';

export const env = {
  API_BASE_URL: Config.API_BASE_URL ?? fallbackApiBaseUrl,
};
