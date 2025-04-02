import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  FormScreen: undefined;
  AnswersScreen: undefined;
  FormSelectorScreen: undefined;
  PhotoReportScreen: undefined;
};

type Props = StackScreenProps<RootStackParamList, 'FormSelectorScreen'>;

const FormSelectorScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Cartão: CHECK LIST ANEXO II */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('FormScreen')}>
        <Text style={styles.cardTitle}>CHECK LIST ANEXO II</Text>
        <Image source={require('../assets/images/check.png')} style={styles.image} />
      </TouchableOpacity>

      {/* Cartão: RELATÓRIO FOTOGRÁFICO (desabilitado por enquanto) */}
      {/* Cartão: RELATÓRIO FOTOGRÁFICO */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PhotoReportScreen')}>
        <Text style={styles.cardTitle}>RELATÓRIO FOTOGRÁFICO</Text>
        <Image source={require('../assets/images/fotografico.png')} style={styles.image} />
      </TouchableOpacity>


      {/* Cartão: RAT */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>RAT - RELATÓRIO DE ATENDIMENTO TÉCNICO</Text>
        <Image source={require('../assets/images/rat.png')} style={styles.image} />
      </View>

      {/* Cartão: Outros */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Outro</Text>
        <Text style={styles.cardSubtitle}>Possibilidade de novos formulários no futuro</Text>
      </View>

      {/* Botão para AnswersScreen */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AnswersScreen')}>
        <Text style={styles.buttonText}>Ver Respostas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 40, // 👈 espaço maior entre topo e primeiro formulário
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20, // 👈 espaço entre os cartões
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: '#009',                  // cor preta suave
    shadowOpacity: 0.05,                  // menos opaca
    shadowOffset: { width: 0, height: 3 }, // altura mais baixa
    shadowRadius: 6,                      // suavidade
    elevation: 8,                         // sombra leve no Android
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  image: {
    width: 90,  // 👈 aumentei
    height: 100, // 👈 aumentei
    resizeMode: 'contain',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#4c6ef5',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


export default FormSelectorScreen;
