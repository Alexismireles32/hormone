const AsyncStorage = require('@react-native-async-storage/async-storage').default;

AsyncStorage.clear().then(() => {
  console.log('✅ AsyncStorage cleared! Onboarding will start fresh.');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
