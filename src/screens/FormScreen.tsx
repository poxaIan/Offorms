// src/screens/FormScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { enviarParaExcel } from "../services/formService";

// Tipagem das rotas
type RootStackParamList = {
  Home: undefined;
  FormScreen: undefined;
  AnswersScreen: undefined;
};

// Props de navegação
type Props = StackScreenProps<RootStackParamList, "FormScreen">;

// Todas as perguntas importadas do Excel
const perguntas = [
  { id: "nomeTecnico", texto: "Qual o nome do técnico responsável?" },
  { id: "matricula", texto: "Qual a matrícula?" },
  { id: "tag", texto: "Qual a TAG?" },
  { id: "potencia", texto: "Qual valor da potência? (W)" },
  { id: "data", texto: "Qual a data?" },
  { id: "hasteModelo", texto: "HASTE – Foi realizado a verificação do modelo da haste?" },
  { id: "modeloHaste", texto: "Qual modelo da haste?" },
  { id: "qrCodeBaterias", texto: "BANCO DE BATERIAS - Foi realizado a aplicação do QR Code da Fispq das baterias?" },
  { id: "pavianTrocaAcu", texto: "PAVIAN - Foi realizada troca da placa ACU11/ACU18 com a priorização de alarmes e novas melodias?" },
  { id: "pavianDisjuntores", texto: "PAVIAN - Foi realizada a verificação de identificação dos disjuntores?" },
  { id: "pavianDownloadRadios", texto: "PAVIAN - Foi feito o download dos arquivos dos rádios?" },
  { id: "pavianAcessoAutorizado", texto: "PAVIAN - Foi realizada a verificação de acesso autorizado?" },
  { id: "pavianTesteComunicacao", texto: "PAVIAN - Foi verificado teste de comunicação?" },
  { id: "pavianVedacao", texto: "PAVIAN - Foi verificado a vedação se a mesma está em condições normais?" },
  { id: "pavianCabos", texto: "PAVIAN - Foi verificado se os cabeamentos estão organizados e em condições de manter a performance da funcionalidade do ativo?" },
  { id: "versaoPavian", texto: "Qual a versão do PAVIAN?" },
  { id: "coletaAcu11", texto: "PAVIAN - Foi realizado a coleta do número de série da ACU-11?" },
  { id: "numeroSerieAcu11", texto: "Qual o número de série da ACU-11?" },
  { id: "coletaMag15Primario", texto: "PAVIAN - Foi realizado a coleta do número de série da MAG-15 (primário)?" },
  { id: "numeroSerieMag15Primario", texto: "Qual o número de série da MAG-15 (primário)?" },
  { id: "coletaMag15Secundario", texto: "PAVIAN - Foi realizado a coleta do número de série da MAG-15 (secundário)?" },
  { id: "numeroSerieMag15Secundario", texto: "Qual o número de série da MAG-15 (secundário)?" },
  { id: "coletaSbr18Primario", texto: "PAVIAN - Foi realizado a coleta do número de série da SBR-18 (primário)?" },
  { id: "numeroSerieSbr18Primario", texto: "Qual o número de série da SBR-18 (primário)?" },
  { id: "coletaSbr18Secundario", texto: "PAVIAN - Foi realizado a coleta do número de série da SBR-18 (Secundário)?" },
  { id: "numeroSerieSbr18Secundario", texto: "Qual o número de série da SBR-18 (Secundário)?" },
  { id: "coletaPdm", texto: "PAVIAN - Foi realizado a coleta do número de série da PDM-11/18?" },
  { id: "numeroSeriePdm", texto: "Qual o número de série da série da PDM-11/18?" },
  { id: "coletaAmp07", texto: "PAVIAN - Foi realizado a coleta do número de série dos AMP-07?" },
  { id: "numeroSerieAmp07_1", texto: "Qual número de série AMP-07 do amplificador 01?" },
  { id: "numeroSerieAmp07_2", texto: "Qual número de série AMP-07 do amplificador 02?" },
  { id: "numeroSerieAmp07_3", texto: "Qual número de série AMP-07 do amplificador 03?" },
  { id: "numeroSerieAmp07_4", texto: "Qual número de série AMP-07 do amplificador 04?" },
  { id: "numeroSerieAmp07_5", texto: "Qual número de série AMP-07 do amplificador 05?" },
  { id: "numeroSerieAmp07_6", texto: "Qual número de série AMP-07 do amplificador 06?" },
  { id: "numeroSerieAmp07_7", texto: "Qual número de série AMP-07 do amplificador 07?" },
  { id: "numeroSerieAmp07_8", texto: "Qual número de série AMP-07 do amplificador 08?" },
  { id: "numeroSerieAmp07_9", texto: "Qual número de série AMP-07 do amplificador 09?" },
  { id: "numeroSerieAmp07_10", texto: "Qual número de série AMP-07 do amplificador 10?" },
  { id: "disjuntorPdm11", texto: "Foi verificado se o disjuntor da PDM11 está ligado?" },
  { id: "disjuntorAmps", texto: "Foi verificado se os disjuntores dos amplificadores estão ligados?" },
  { id: "coletaAcu18", texto: "PAVIAN - Foi realizado a coleta do número de série da ACU-18?" },
  { id: "numeroSerieAcu18", texto: "Qual o número de série da ACU-18?" },
  { id: "coletaPdm18", texto: "PAVIAN - Foi realizado a coleta do número de série da PDM-18?" },
  { id: "numeroSeriePdm18", texto: "Qual o número de série da PDM-18?" },
  { id: "coletaAmp18", texto: "PAVIAN - Foi realizado a coleta do número de série dos AMP-18?" },
  { id: "numeroSerieAmp18_1", texto: "Qual número de série AMP-18 do amplificador 01?" },
  { id: "numeroSerieAmp18_2", texto: "Qual número de série AMP-18 do amplificador 02?" },
  { id: "numeroSerieAmp18_3", texto: "Qual número de série AMP-18 do amplificador 03?" },
  { id: "numeroSerieAmp18_4", texto: "Qual número de série AMP-18 do amplificador 04?" },
  { id: "numeroSerieAmp18_5", texto: "Qual número de série AMP-18 do amplificador 05?" },
  { id: "coletaRadioPrimario", texto: "PAVIAN - Foi realizado a coleta do número de série do Rádio primário?" },
  { id: "numeroSerieRadioPrimario", texto: "Qual número de série do Rádio primário?" },
  { id: "coletaRadioSecundario", texto: "PAVIAN - Foi realizado a coleta do número de série do Rádio secundário?" },
  { id: "numeroSerieRadioSecundario", texto: "Qual número de série do Rádio secundário?" },
  { id: "coletaConversorPrimario", texto: "PAVIAN - Foi realizado a coleta do número de série do Conversor primário?" },
  { id: "numeroSerieConversorPrimario", texto: "Qual número de série do Conversor primário?" },
  { id: "coletaConversorSecundario", texto: "PAVIAN - Foi realizado a coleta do número de série do Conversor secundário?" },
  { id: "numeroSerieConversorSecundario", texto: "Qual número de série do Conversor secundário?" },
  { id: "disjuntorBorneRele", texto: "Foi verificado se o disjuntor do borne relé está ligado?" },
  { id: "disjuntorRadioPrimario", texto: "Foi verificado se o disjuntor do conversor rádio primário está ligado?" },
  { id: "disjuntorRadioSecundario", texto: "Foi verificado se o disjuntor do conversor rádio secundário está ligado?" },
  { id: "disjuntorLuminaria", texto: "Foi verificado se o disjuntor da luminária interna está desligado?" },
  { id: "disjuntorControladorCarga", texto: "Foi verificado se o disjuntor do controlador de carga está ligado?" },
  { id: "disjuntorPainelSolar", texto: "Foi verificado se o disjuntor do painel solar está ligado?" },
  { id: "carregamentoBaterias", texto: "Foi verificado o carregamento das baterias via controlador de carga?" }
];

// Lista das perguntas que exigem entrada de texto
const perguntasDeTexto = new Set([
  "nomeTecnico", "matricula", "tag", "potencia", "data", "modeloHaste",
  "numeroSerieAcu11", "numeroSerieMag15Primario", "numeroSerieMag15Secundario",
  "numeroSerieSbr18Primario", "numeroSerieSbr18Secundario", "numeroSeriePdm",
  "numeroSerieAmp07_1", "numeroSerieAmp07_2", "numeroSerieAmp07_3", "numeroSerieAmp07_4",
  "numeroSerieAmp07_5", "numeroSerieAmp07_6", "numeroSerieAmp07_7", "numeroSerieAmp07_8",
  "numeroSerieAmp07_9", "numeroSerieAmp07_10", "numeroSerieAcu18", "numeroSeriePdm18",
  "numeroSerieAmp18_1", "numeroSerieAmp18_2", "numeroSerieAmp18_3", "numeroSerieAmp18_4",
  "numeroSerieAmp18_5", "numeroSerieRadioPrimario", "numeroSerieRadioSecundario",
  "numeroSerieConversorPrimario", "numeroSerieConversorSecundario", "versaoPavian"
]);

const FormScreen: React.FC<Props> = ({ navigation }) => {
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [expandedSection, setExpandedSection] = useState<number>(1); // Seção 1 já aberta
  const [versaoPavian, setVersaoPavian] = useState<string | null>(null); // Estado para versão do PAVIAN

  const selecionarResposta = (id: string, resposta: string) => {
    setRespostas((prev) => ({
      ...prev,
      [id]: resposta,
    }));
  };

  const preencherAleatorio = () => {
    if (!versaoPavian) {
      Alert.alert("Erro", "Selecione uma versão antes de preencher aleatoriamente.");
      return;
    }

    const respostasAleatorias: Record<string, string> = {};

    // Preenche aleatoriamente as perguntas 1 a 15
    for (let i = 0; i < 16; i++) {
      const p = perguntas[i];
      const opcoes = ["Sim", "Não", "N/A"];
      const aleatoria = opcoes[Math.floor(Math.random() * opcoes.length)];
      respostasAleatorias[p.id] = aleatoria;
    }

    // Se G3 for selecionado, preenche as perguntas 42 a 51 com N/A
    if (versaoPavian === "G3") {
      for (let i = 41; i < 51; i++) {
        const p = perguntas[i];
        respostasAleatorias[p.id] = "N/A"; // Preenche com N/A para G3
      }
      for (let i = 16; i < 41; i++) {
        const p = perguntas[i];
        const opcoes = ["Sim", "Não", "N/A"];
        const aleatoria = opcoes[Math.floor(Math.random() * opcoes.length)];
        respostasAleatorias[p.id] = aleatoria;
      }
    }

    // Se G4 for selecionado, preenche as perguntas 17 a 41 com N/A
    if (versaoPavian === "G4") {
      for (let i = 16; i < 41; i++) {
        const p = perguntas[i];
        respostasAleatorias[p.id] = "N/A"; // Preenche com N/A para G4
      }
      for (let i = 41; i < 51; i++) {
        const p = perguntas[i];
        const opcoes = ["Sim", "Não", "N/A"];
        const aleatoria = opcoes[Math.floor(Math.random() * opcoes.length)];
        respostasAleatorias[p.id] = aleatoria;
      }
    }

    // Preenche aleatoriamente as perguntas 52 em diante
    for (let i = 51; i < perguntas.length; i++) {
      const p = perguntas[i];
      const opcoes = ["Sim", "Não", "N/A"];
      const aleatoria = opcoes[Math.floor(Math.random() * opcoes.length)];
      respostasAleatorias[p.id] = aleatoria;
    }

    setRespostas(respostasAleatorias);
  };





  const enviar = () => {
    // Verificar se todas as perguntas foram respondidas
    const perguntasNaoRespondidas = perguntas.filter((p) => !respostas[p.id]);

    if (perguntasNaoRespondidas.length > 0) {
      const perguntasFaltando = perguntasNaoRespondidas.map((p) => p.texto).join("\n");
      Alert.alert("Erro", `As seguintes perguntas não foram respondidas:\n${perguntasFaltando}`);
      return;
    }

    Alert.alert(
      "Confirmar Envio",
      perguntas.map((p) => `${p.texto}: ${respostas[p.id]}`).join("\n"),
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () =>
            enviarParaExcel(
              respostas,
              perguntas,
              () => {
                Alert.alert("Sucesso", "Respostas enviadas com sucesso!");
                navigation.goBack();
              },
              () => {
                Alert.alert("Erro", "Falha ao enviar. Salvo localmente.");
              }
            ),
        },
      ]
    );
  };




  // Função para alternar o estado de expansão das seções
  const toggleSection = (sectionNumber: number) => {
    if (expandedSection === sectionNumber) {
      setExpandedSection(0); // Fechar a seção
    } else {
      setExpandedSection(sectionNumber); // Abrir a seção
    }
  };

  // Função para renderizar cada seção com as perguntas
  const renderSection = (startIndex: number, endIndex: number, title: string, sectionNumber: number) => (
    <View style={styles.section}>
      <TouchableOpacity onPress={() => toggleSection(sectionNumber)}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </TouchableOpacity>

      {expandedSection === sectionNumber && (
        <View>
          {perguntas.slice(startIndex, endIndex).map((p, index) => (
            <View key={p.id} style={styles.card}>
              <Text style={styles.question}>{`Pergunta ${startIndex + index + 1}: ${p.texto}`}</Text>
              {perguntasDeTexto.has(p.id) ? (
                <TextInput
                  style={styles.textInput}
                  placeholder="Digite aqui"
                  value={respostas[p.id] || ""}
                  onChangeText={(text) => selecionarResposta(p.id, text)}
                />
              ) : (
                <View style={styles.buttonGroup}>
                  {["Sim", "Não", "N/A"].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        respostas[p.id] === option && styles.selectedButton,
                      ]}
                      onPress={() => selecionarResposta(p.id, option)}
                    >
                      <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Check List II</Text>

      <View style={styles.buttonTopGroup}>
        <Button title="Enviar" onPress={enviar} />
        <View style={{ height: 10 }} />
        <Button title="Ver Respostas" onPress={() => navigation.navigate("AnswersScreen")} />
        <View style={{ height: 10 }} />
        <Button title="Preencher aleatório (teste)" onPress={preencherAleatorio} />
      </View>

      {/* Pergunta para selecionar a versão */}
      <View style={styles.card}>
        <Text style={styles.question}>Qual a versão do PAVIAN?</Text>
        <View style={styles.buttonGroup}>
          {["G3", "G4"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                versaoPavian === option && styles.selectedButton,
              ]}
              onPress={() => {
                setVersaoPavian(option);

                // Preencher com N/A conforme a versão selecionada
                const respostasComNA: Record<string, string> = { ...respostas };

                // Se G3 for selecionado, preenche as perguntas 42 a 51 com N/A (Índices 41 a 50)
                if (option === "G3") {
                  for (let i = 41; i < 51; i++) {
                    const p = perguntas[i];
                    respostasComNA[p.id] = "N/A"; // Preenche com N/A para G3
                  }

                  respostasComNA["versaoPavian"] = "G3"; // Preenche a versão com "G3"
                }

                // Se G4 for selecionado, preenche as perguntas 17 a 41 com N/A (Índices 16 a 40)
                if (option === "G4") {
                  for (let i = 16; i < 41; i++) {
                    const p = perguntas[i];
                    respostasComNA[p.id] = "N/A"; // Preenche com N/A para G4
                  }

                  respostasComNA["versaoPavian"] = "G4"; // Preenche a versão com "G4"

                }

                setRespostas(respostasComNA); // Atualiza as respostas com N/A
              }}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>


      {/* Renderizar seções baseadas na versão selecionada */}
      {renderSection(0, 16, "PROTOCOLO DE REALIZAÇÃO DE CHECK LIST DO SISTEMA DE SINALIZAÇÃO SONORO E VISUAL", 1)}
      {versaoPavian === "G3" && renderSection(16, 41, "Perguntas referentes à versão G3 do Pavian", 2)}
      {versaoPavian === "G4" && renderSection(41, 51, "Perguntas referentes à versão G4 do Pavian", 3)}
      {renderSection(51, perguntas.length, "Perguntas Finais", 4)}

      <View style={{ marginTop: 20 }}>
        <Button title="Enviar" onPress={enviar} />
        <View style={{ height: 10 }} />
        <Button title="Ver Respostas" onPress={() => navigation.navigate("AnswersScreen")} />
        <View style={{ height: 10 }} />
        <Button title="Preencher aleatório (teste)" onPress={preencherAleatorio} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
  section: { marginBottom: 30 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    textAlign: "center",
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sectionTitleExpanded: {
    backgroundColor: "#0056b3",
  },
  card: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  question: { fontSize: 16, fontWeight: "500", marginBottom: 10, color: "#555" },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  buttonGroup: { flexDirection: "row", justifyContent: "space-between" },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  optionText: { color: "#333" },
  buttonTopGroup: { marginBottom: 30 },
});

export default FormScreen;

export default FormScreen;