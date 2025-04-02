import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import FormScreen from './src/screens/CheckList';
import AnswersScreen from './src/screens/AnswersScreen';
import FormSelectorScreen from './src/screens/FormSelectorScreen';
import PhotoReportScreen from './src/screens/PhotoReportScreen'; // 👈 novo import

type RootStackParamList = {
  Home: undefined;
  FormSelectorScreen: undefined;
  FormScreen: undefined;
  AnswersScreen: undefined;
  PhotoReportScreen: undefined; // 👈 nova rota
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '' }} />
        <Stack.Screen name="FormSelectorScreen" component={FormSelectorScreen} options={{ title: 'Formulários Disponíveis' }}/>
        <Stack.Screen name="FormScreen" component={FormScreen} options={{ title: 'Check List II' }} />
        <Stack.Screen name="PhotoReportScreen" component={PhotoReportScreen} options={{ title: 'Relatório Fotográfico' }} />
        <Stack.Screen name="AnswersScreen" component={AnswersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
