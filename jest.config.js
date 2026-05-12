module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-navigation|@react-native-async-storage|redux-persist|@reduxjs/toolkit|immer|react-redux)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/backend/'],
};
