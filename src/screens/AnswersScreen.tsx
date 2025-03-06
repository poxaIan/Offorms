import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// 🚀 Substitua pela URL gerada no Power Automate
const POWER_AUTOMATE_URL = "https://prod-23.brazilsouth.logic.azure.com:443/workflows/133e3141c8e3430e83e7b632b9ada0fb/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=siyI6pojGkO0qex9fh34_5XSHYVUdtAfXCQy6zO11C4";

const AnswersScreen: React.FC = () => {
  const [respostas, setRespostas] = useState<any[]>([]);

  // 📌 Carregar respostas salvas ao abrir a tela
  useEffect(() => {
    carregarRespostas();
  }, []);

  const carregarRespostas = async () => {
    try {
      const respostasSalvas = await AsyncStorage.getItem("respostas");
      if (respostasSalvas) {
        const lista = JSON.parse(respostasSalvas);
        setRespostas(lista.reverse()); // Inverte a ordem para exibir o mais recente primeiro
      } else {
        setRespostas([]);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar respostas:", error);
    }
  };

  // 📌 Função para reenviar respostas pendentes
  const reenviarRespostasPendentes = async () => {
    try {
      const respostasSalvas = await AsyncStorage.getItem("respostas");
      const listaRespostas = respostasSalvas ? JSON.parse(respostasSalvas) : [];

      const pendentes = listaRespostas.filter((resposta) => resposta.status === "pendente");

      if (pendentes.length === 0) {
        Alert.alert("Nenhuma resposta pendente", "Todas as respostas já foram enviadas.");
        return;
      }

      for (const resposta of pendentes) {
        try {
          const response = await axios.post(POWER_AUTOMATE_URL, resposta, {
            headers: { "Content-Type": "application/json" },
          });

          console.log("✅ Resposta reenviada:", response.data);
          resposta.status = "enviado";
        } catch (error) {
          console.error("❌ Falha ao reenviar:", error);
        }
      }

      // Atualizar o AsyncStorage com os novos status
      await AsyncStorage.setItem("respostas", JSON.stringify(listaRespostas));
      setRespostas(listaRespostas.reverse()); // Mantém a ordem mais recente primeiro
      Alert.alert("Sucesso", "Respostas pendentes reenviadas!");
    } catch (error) {
      console.error("❌ Erro ao reenviar respostas:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Respostas</Text>

      {respostas.length === 0 ? (
        <Text style={styles.noDataText}>Nenhuma resposta salva.</Text>
      ) : (
        <FlatList
          data={respostas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{`ID: ${item.id}`}</Text>
              <Text>{`Hora de Início: ${item["Hora de início"]}`}</Text>
              <Text>{`Pergunta 1: ${item["Pergunta 1"]}`}</Text>
              <Text>{`Pergunta 2: ${item["Pergunta 2"]}`}</Text>
              <Text>{`Pergunta 3: ${item["Pergunta 3"]}`}</Text>
              <Text style={{ color: item.status === "pendente" ? "red" : "green", fontWeight: "bold" }}>
                {`Status: ${item.status}`}
              </Text>
            </View>
          )}
        />
      )}

      <Button title="Reenviar Pendentes" onPress={reenviarRespostasPendentes} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  noDataText: { textAlign: "center", fontSize: 16, color: "#777" },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
});

export default AnswersScreen;
