import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import FormScreen from './src/screens/FormScreen';
import AnswersScreen from './src/screens/AnswersScreen';

type RootStackParamList = {
  Home: undefined;
  FormScreen: undefined; // O nome aqui precisa ser "FormScreen"
  AnswersScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
        <Stack.Screen name="FormScreen" component={FormScreen} options={{ title: 'Formulário' }} />
        <Stack.Screen name="AnswersScreen" component={AnswersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
