import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import FormScreen from './src/screens/FormScreen';

type RootStackParamList = {
  Home: undefined;
  FormScreen: undefined; // O nome aqui precisa ser "FormScreen"
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
        <Stack.Screen name="FormScreen" component={FormScreen} options={{ title: 'Formulário' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
