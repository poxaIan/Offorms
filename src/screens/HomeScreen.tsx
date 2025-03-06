import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

// Definição dos tipos de navegação
type RootStackParamList = {
  Home: undefined;
  FormScreen: undefined;
  AnswersScreen: undefined;
};

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Offorms</Text>

      {/* Botão para preencher o formulário */}
      <Button title="Preencher Formulário" onPress={() => navigation.navigate('FormScreen')} />

      {/* Botão para visualizar as respostas salvas */}
      <Button title="Ver Respostas" onPress={() => navigation.navigate('AnswersScreen')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomeScreen;
