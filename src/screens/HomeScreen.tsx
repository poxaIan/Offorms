import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
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
      {/* Imagem acima do nome "OffForms" */}
      <Image source={require('../assets/images/home.png')} style={styles.image} />

      <Text style={styles.title}>OffForms</Text>
      <Text style={styles.subtitle}>Sua maneira mais fácil de lidar com formulários corporativos</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FormScreen')}
      >
        <Text style={styles.buttonText}>Começar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // <- aqui estava '#f5f5f5'
    padding: 20,
  },
  image: {
    width: 250, // ajuste conforme o tamanho ideal
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4c4c8c',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#7f7f7f',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4c6ef5',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
