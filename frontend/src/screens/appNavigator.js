import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import MainChat from './mainChat';
import nssiCalendar from './nssiCalendarScreen';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="MainChat"
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fff',
          width: 240,
        },
        drawerActiveTintColor: '#FF804C',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          fontSize: 16,
          marginLeft: 5,
        },
        headerStyle: {
          backgroundColor: '#FF804C',
        },
        headerTintColor: '#fff',
      }}
    >
      <Drawer.Screen name="MainChat" component={MainChat} options={{ title: 'uBot' }} />
      <Drawer.Screen name="nssiCalendar" component={nssiCalendar} options={{ title: 'Calendario NSSI' }} />
    </Drawer.Navigator>
  );
}
