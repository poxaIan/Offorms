import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { StackScreenProps } from "@react-navigation/stack";

// 🚀 Cole aqui a URL gerada no Power Automate
const POWER_AUTOMATE_URL = "https://prod-23.brazilsouth.logic.azure.com:443/workflows/133e3141c8e3430e83e7b632b9ada0fb/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=siyI6pojGkO0qex9fh34_5XSHYVUdtAfXCQy6zO11C4";

type RootStackParamList = {
  Home: undefined;
  FormScreen: undefined;
};

type Props = StackScreenProps<RootStackParamList, "FormScreen">;

const FormScreen: React.FC<Props> = ({ navigation }) => {
  const [respostas, setRespostas] = useState<Record<string, string>>({
    pergunta1: "",
    pergunta2: "",
    pergunta3: "",
  });

  const selecionarResposta = (pergunta: string, resposta: string) => {
    setRespostas((prev) => ({
      ...prev,
      [pergunta]: resposta,
    }));
  };

  const enviarParaExcel = async () => {
    if (!respostas.pergunta1 || !respostas.pergunta2 || !respostas.pergunta3) {
      Alert.alert("Erro", "Responda todas as perguntas antes de enviar.");
      return;
    }

    // 🔥 Dados que serão enviados para o Power Automate
    const dados = {
      id: 25, // O Power Automate vai calcular o ID automaticamente
      "Hora de início": new Date().toLocaleString(),
      "Hora de conclusão": new Date().toLocaleString(),
      email: "anonima@example.com",
      nome: "Usuário Anônimo",
      "Pergunta 1": respostas.pergunta1,
      "Pergunta 2": respostas.pergunta2,
      "Pergunta 3": respostas.pergunta3,
    };

    console.log("🔄 Enviando dados para o Power Automate:", dados);

    Alert.alert(
      "Confirmação de Envio",
      `Os seguintes dados serão enviados:\n\n` +
        `Id: ${dados.id}\n` +
        `Hora de Início: ${dados["Hora de início"]}\n` +
        `Hora de Conclusão: ${dados["Hora de conclusão"]}\n` +
        `E-mail: ${dados.email}\n` +
        `Nome: ${dados.nome}\n` +
        `Pergunta 1: ${dados["Pergunta 1"]}\n` +
        `Pergunta 2: ${dados["Pergunta 2"]}\n` +
        `Pergunta 3: ${dados["Pergunta 3"]}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => console.log("🚫 Envio cancelado"),
        },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              const response = await axios.post(POWER_AUTOMATE_URL, dados, {
                headers: { "Content-Type": "application/json" },
              });

              console.log("✅ Resposta do Power Automate:", response.data);
              Alert.alert("Sucesso", "Respostas enviadas para o Excel!");
              navigation.goBack();
            } catch (error) {
              console.error("❌ Erro ao enviar para Power Automate:", error);
              Alert.alert("Erro", "Não foi possível salvar os dados.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulário</Text>
      {["pergunta1", "pergunta2", "pergunta3"].map((pergunta) => (
        <View key={pergunta}>
          <Text style={styles.question}>{pergunta.replace("pergunta", "Pergunta ")}</Text>
          <View style={styles.buttonGroup}>
            {["Sim", "Não", "N/A"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  respostas[pergunta] === option && styles.selectedButton,
                ]}
                onPress={() => selecionarResposta(pergunta, option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
      <Button title="Enviar" onPress={enviarParaExcel} />
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  question: { fontSize: 18, marginBottom: 10 },
  buttonGroup: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  selectedButton: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  optionText: { fontSize: 16, color: "#333" },
});

export default FormScreen;
