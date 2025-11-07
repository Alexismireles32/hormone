import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e0e0e0',
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          title: 'Test',
          tabBarLabel: 'Test',
        }}
      />
      <Tabs.Screen
        name="ask"
        options={{
          title: 'Ask',
          tabBarLabel: 'Ask',
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: 'Track',
          tabBarLabel: 'Track',
        }}
      />
      <Tabs.Screen
        name="tribe"
        options={{
          title: 'Tribe',
          tabBarLabel: 'Tribe',
        }}
      />
    </Tabs>
  );
}

