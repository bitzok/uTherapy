import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainMenu from './src/screens/mainMenuScreen';
import MainChat from './src/screens/mainChat';
import Register from './src/screens/registerScreen';
import VerificationCode from './src/screens/verificationCodeScreen';
import Password from './src/screens/passwordScreen';
import LoginScreen from './src/screens/loginScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="VerificationCode" component={VerificationCode} />
        <Stack.Screen name="Password" component={Password} />
        <Stack.Screen name="MainChat" component={MainChat} />
        <Stack.Screen name = "Login" component={LoginScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
