import { View, Text, StyleSheet } from 'react-native';

export default function Test() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Test</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 24,
    color: '#000000',
  },
});

