import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CheckBox from "@react-native-community/checkbox";

// 🚀 URL gerada pelo Power Automate
const POWER_AUTOMATE_URL = "https://prod-23.brazilsouth.logic.azure.com:443/workflows/133e3141c8e3430e83e7b632b9ada0fb/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=siyI6pojGkO0qex9fh34_5XSHYVUdtAfXCQy6zO11C4";

// ✅ **Definição da estrutura das respostas**
interface Resposta {
  id: string;
  "Hora de início": string;
  "Hora de conclusão": string;
  email: string;
  nome: string;
  "Pergunta 1": string;
  "Pergunta 2": string;
  "Pergunta 3": string;
  status: "pendente" | "enviado";
}

const AnswersScreen: React.FC = () => {
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const navigation = useNavigation();

  // 📌 Carregar respostas ao abrir a tela
  useEffect(() => {
    carregarRespostas();
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setModoEdicao(!modoEdicao)} style={styles.editButton}>
          <Ionicons name={modoEdicao ? "close" : "create"} size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [modoEdicao]);

  const carregarRespostas = async () => {
    try {
      const respostasSalvas = await AsyncStorage.getItem("respostas");
      if (respostasSalvas) {
        setRespostas(JSON.parse(respostasSalvas));
      } else {
        setRespostas([]);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar respostas:", error);
    }
  };

  // 📌 Alternar seleção de uma resposta
  const alternarSelecao = (id: string) => {
    const novaSelecao = new Set(selecionados);
    if (novaSelecao.has(id)) {
      novaSelecao.delete(id);
    } else {
      novaSelecao.add(id);
    }
    setSelecionados(novaSelecao);
  };

  // 📌 Excluir respostas selecionadas
  const excluirRespostasSelecionadas = async () => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja excluir ${selecionados.size} resposta(s)?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const respostasAtualizadas = respostas.filter(
                (resposta) => !selecionados.has(resposta.id)
              );
              await AsyncStorage.setItem("respostas", JSON.stringify(respostasAtualizadas));
              setRespostas(respostasAtualizadas);
              setSelecionados(new Set());
              setModoEdicao(false);
              console.log("🗑️ Respostas excluídas!");
            } catch (error) {
              console.error("❌ Erro ao excluir respostas:", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  // 📌 Reenviar respostas pendentes
  const reenviarRespostasPendentes = async () => {
    try {
      const respostasSalvas = await AsyncStorage.getItem("respostas");
      const listaRespostas: Resposta[] = respostasSalvas ? JSON.parse(respostasSalvas) : [];

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

      // Atualiza o AsyncStorage com os novos status
      await AsyncStorage.setItem("respostas", JSON.stringify(listaRespostas));
      setRespostas(listaRespostas);
      Alert.alert("Sucesso", "Respostas pendentes reenviadas!");
    } catch (error) {
      console.error("❌ Erro ao reenviar respostas:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Respostas</Text>

      {modoEdicao && selecionados.size > 0 && (
        <TouchableOpacity style={styles.deleteButton} onPress={excluirRespostasSelecionadas}>
          <Ionicons name="trash" size={24} color="white" />
          <Text style={styles.deleteButtonText}>Excluir Selecionados</Text>
        </TouchableOpacity>
      )}

      {respostas.length === 0 ? (
        <Text style={styles.noDataText}>Nenhuma resposta salva.</Text>
      ) : (
        <FlatList
          data={respostas.sort((a, b) => (a["Hora de início"] < b["Hora de início"] ? 1 : -1))}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => modoEdicao && alternarSelecao(item.id)}
              style={[
                styles.item,
                selecionados.has(item.id) && styles.selectedItem,
              ]}
            >
              {modoEdicao && (
                <CheckBox
                value={selecionados.has(item.id)}
                onValueChange={() => alternarSelecao(item.id)}
              />
              
              )}
              <View style={{ marginLeft: 10 }}>
                <Text>{`ID: ${item.id}`}</Text>
                <Text>{`Hora de Início: ${item["Hora de início"]}`}</Text>
                <Text>{`Pergunta 1: ${item["Pergunta 1"]}`}</Text>
                <Text>{`Pergunta 2: ${item["Pergunta 2"]}`}</Text>
                <Text>{`Pergunta 3: ${item["Pergunta 3"]}`}</Text>
                <Text style={{ color: item.status === "pendente" ? "red" : "green", fontWeight: "bold" }}>
                  {`Status: ${item.status}`}
                </Text>
              </View>
            </TouchableOpacity>
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
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd", marginBottom: 10 },
  selectedItem: { backgroundColor: "#d3d3d3" },
  editButton: {
    marginRight: 15,
    padding: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButtonText: { color: "white", fontWeight: "bold", marginLeft: 10 },
});

export default AnswersScreen;
