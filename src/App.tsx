import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { HomeScreen } from '@screens/HomeScreen';
import { ScanScreen } from '@screens/ScanScreen';
import { ResultScreen } from '@screens/ResultScreen';

export type RootStackParamList = {
  Home: undefined;
  Scan: undefined;
  Result: {
    isVegan: boolean;
    ingredients: string[];
    explanation?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#4CAF50" 
      />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="Scan" 
          component={ScanScreen}
          options={{
            title: 'Scanna Ingredienser'
          }}
        />
        <Stack.Screen 
          name="Result" 
          component={ResultScreen}
          options={{
            title: 'Resultat',
            headerBackTitle: 'Tillbaka'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}