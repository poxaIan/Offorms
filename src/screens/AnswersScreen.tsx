import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// URL do Power Automate
const POWER_AUTOMATE_URL = "https://prod-23.brazilsouth.logic.azure.com:443/workflows/133e3141c8e3430e83e7b632b9ada0fb/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=siyI6pojGkO0qex9fh34_5XSHYVUdtAfXCQy6zO11C4";

interface Resposta {
  id: string;
  tag: string;
  "Hora de início": string;
  "Hora de conclusão": string;
  email: string;
  nome: string;
  status: "pendente" | "enviado";
}

const AnswersScreen: React.FC = () => {
  const [respostas, setRespostas] = useState<Resposta[]>([]);

  useEffect(() => {
    carregarRespostas();
  }, []);

  const carregarRespostas = async () => {
    try {
      const dados = await AsyncStorage.getItem("respostas");
      setRespostas(dados ? JSON.parse(dados) : []);
    } catch (error) {
      console.error("Erro ao carregar respostas:", error);
    }
  };

  const reenviarRespostasPendentes = async () => {
    try {
      const pendentes = respostas.filter(r => r.status === "pendente");

      if (pendentes.length === 0) {
        Alert.alert("Tudo certo!", "Nenhuma resposta pendente.");
        return;
      }

      for (const resposta of pendentes) {
        try {
          await axios.post(POWER_AUTOMATE_URL, resposta, {
            headers: { "Content-Type": "application/json" },
          });
          resposta.status = "enviado";
        } catch (err) {
          console.error("Erro ao reenviar:", err);
        }
      }

      await AsyncStorage.setItem("respostas", JSON.stringify(respostas));
      setRespostas([...respostas]);
      Alert.alert("Concluído", "Respostas pendentes reenviadas.");
    } catch (error) {
      console.error("Erro no reenvio:", error);
    }
  };

  const formatarData = (dataStr: string) => {
    const data = new Date(dataStr);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Respostas Enviadas</Text>

      {respostas.length === 0 ? (
        <Text style={styles.noDataText}>Nenhuma resposta salva.</Text>
      ) : (
        <FlatList
          data={[...respostas].reverse()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{item.tag || "Sem TAG"}</Text>
                <Text style={styles.cardDate}>{formatarData(item["Hora de conclusão"])}</Text>
              </View>
              <Text
                style={[
                  styles.cardStatus,
                  item.status === "pendente" ? styles.statusPendente : styles.statusEnviado,
                ]}
              >
                Status: {item.status === "pendente" ? "Aguardando Conexão" : "Enviado"}
              </Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={reenviarRespostasPendentes}>
        <Text style={styles.buttonText}>Enviar Pendentes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginVertical: 20 },
  noDataText: { textAlign: "center", fontSize: 16, color: "#777" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  cardDate: {
    fontSize: 13,
    color: "#888",
  },
  cardStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  statusPendente: {
    color: "red",
  },
  statusEnviado: {
    color: "#4c6ef5",
  },
  button: {
    backgroundColor: "#4c6ef5",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginVertical: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AnswersScreen;
