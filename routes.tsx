import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Onboarding from './pages/Onboarding';
import Login from './pages/Login';

const AppStack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: 'white',
          },
        }}
      >
        <AppStack.Screen name="Onboarding" component={Onboarding} />
        <AppStack.Screen name="Login" component={Login} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;