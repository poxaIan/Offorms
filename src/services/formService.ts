// src/services/formService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import uuid from "react-native-uuid";

const POWER_AUTOMATE_URL = "https://prod-23.brazilsouth.logic.azure.com:443/workflows/133e3141c8e3430e83e7b632b9ada0fb/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=siyI6pojGkO0qex9fh34_5XSHYVUdtAfXCQy6zO11C4";

export const salvarRespostaLocalmente = async (dados: any, status: string) => {
  try {
    const respostasSalvas = await AsyncStorage.getItem("respostas");
    const listaRespostas = respostasSalvas ? JSON.parse(respostasSalvas) : [];

    listaRespostas.push({ ...dados, status });

    await AsyncStorage.setItem("respostas", JSON.stringify(listaRespostas));
    console.log("✅ Resposta salva no histórico:", listaRespostas);
  } catch (error) {
    console.error("❌ Erro ao salvar resposta localmente:", error);
  }
};

export const enviarParaExcel = async (
    respostas: Record<string, string>,
    perguntas: { id: string; texto: string }[],
    onSuccess: () => void,
    onError: () => void
  ) => {
    const dados: Record<string, string> = {
      "Hora de início": new Date().toLocaleString(),
      "Hora de conclusão": new Date().toLocaleString(),
      email: "anonima@example.com",
      nome: "Usuário Anônimo",
      ...Object.fromEntries(perguntas.map((p) => [p.texto.trim(), respostas[p.id]])), // <-- usa o texto da pergunta como chave
    };
  
    try {
      const response = await axios.post(POWER_AUTOMATE_URL, dados, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("✅ Resposta enviada para Power Automate:", response.data);
      await salvarRespostaLocalmente(dados, "enviado");
      onSuccess();
    } catch (error) {
      console.error("❌ Erro ao enviar para Power Automate:", error);
      await salvarRespostaLocalmente(dados, "pendente");
      onError();
    }
  };