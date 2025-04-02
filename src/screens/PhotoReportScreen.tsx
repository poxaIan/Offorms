import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

interface PerguntaImagem {
  id: string;
  texto: string;
  chaveDocx: string;
  versao?: "G3" | "G4";
}

const perguntasTexto = [
  { id: "nome", texto: "Qual o seu nome?" },
  { id: "data", texto: "Qual a Data?" },
  { id: "matricula", texto: "Qual a Matrícula?" },
  { id: "tag", texto: "Qual a TAG?" },
];

const perguntasImagem: PerguntaImagem[] = [
  { id: "img1", texto: "Sirene Vista Frontal", chaveDocx: "imagem 1" },
  { id: "img2", texto: "Sirene Vista Posterior", chaveDocx: "imagem 2" },
  { id: "img3", texto: "Sirene Vista Lateral (Esquerda) da Sirene", chaveDocx: "imagem 3" },
  { id: "img4", texto: "Sirene Vista Lateral (Direita) da Sirene", chaveDocx: "imagem 4" },
  { id: "img5", texto: "QR Code (FISPQ)", chaveDocx: "imagem 5" },
  { id: "img6", texto: "Banco de Baterias (Externo)", chaveDocx: "imagem 6" },
  { id: "img7", texto: "Painel Pavian interno", chaveDocx: "imagem 7" },
  { id: "img8", texto: "Radios de comunicação/Conversores de tensão", chaveDocx: "imagem 8" },
  { id: "img11", texto: "Controlador de Carga", chaveDocx: "imagem 11" },
  { id: "img14", texto: "Disjuntores", chaveDocx: "imagem 14" },
  { id: "img15", texto: "Número de Série (Pavian)", chaveDocx: "imagem 15" },
  { id: "img16", texto: "Foto Externa (Painel Pavian)", chaveDocx: "imagem 16" },
  { id: "img17", texto: "Status do Canal Primário após atuação", chaveDocx: "imagem 17" },
  { id: "img18", texto: "Status do Canal Secundário após atuação", chaveDocx: "imagem 18" },
  { id: "img9", texto: "Painel Pavian (Amplificadores) Esquerdo - AMP 07", chaveDocx: "imagem 9", versao: "G3" },
  { id: "img10", texto: "Painel Pavian (Amplificadores) Direito - AMP 07", chaveDocx: "imagem 10", versao: "G3" },
  { id: "img12", texto: "PDM 11", chaveDocx: "imagem 12", versao: "G3" },
  { id: "img13", texto: "Interfaces de Comunicação - ACU-11/SBR-11", chaveDocx: "imagem 13", versao: "G3" },
  { id: "img9_g4", texto: "Painel Pavian (Amplificadores) - AMP 18", chaveDocx: "imagem 9", versao: "G4" },
  { id: "img10_g4", texto: "Painel Pavian (Amplificadores) - AMP 18", chaveDocx: "imagem 10", versao: "G4" },
  { id: "img12_g4", texto: "PDM 18", chaveDocx: "imagem 12", versao: "G4" },
  { id: "img13_g4", texto: "Interfaces de Comunicação - ACU-18/SBR-18", chaveDocx: "imagem 13", versao: "G4" },
];

const PhotoReportScreen: React.FC = () => {
  const [versao, setVersao] = useState<"G3" | "G4" | null>(null);
  const [respostasTexto, setRespostasTexto] = useState<Record<string, string>>({});
  const [imagens, setImagens] = useState<Record<string, string>>({});

  const escolherImagem = async (id: string) => {
    const result = await launchImageLibrary({ mediaType: 'photo', includeBase64: true });
    if (result.assets && result.assets.length > 0 && result.assets[0].base64) {
      setImagens({ ...imagens, [id]: result.assets[0].base64 });
    }
  };

  const enviarFormulario = () => {
    if (!versao) return Alert.alert("Erro", "Selecione a versão do Pavian");
    Alert.alert("Pronto para gerar o relatório com as imagens e textos");
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={styles.title}>Relatório Fotográfico</Text>

      <Text style={styles.label}>Qual a versão do PAVIAN?</Text>
      <View style={styles.opcoesLinha}>
        {['G3', 'G4'].map((v) => (
          <TouchableOpacity
            key={v}
            style={[styles.opcao, versao === v && styles.opcaoSelecionada]}
            onPress={() => setVersao(v as 'G3' | 'G4')}
          >
            <Text>{v}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {perguntasTexto.map((p) => (
        <View key={p.id} style={{ marginBottom: 12 }}>
          <Text style={styles.label}>{p.texto}</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite aqui"
            value={respostasTexto[p.id] || ""}
            onChangeText={(text) => setRespostasTexto({ ...respostasTexto, [p.id]: text })}
          />
        </View>
      ))}

      {perguntasImagem.map((p) => {
        if (p.versao && p.versao !== versao) return null;
        return (
          <View key={p.id} style={{ marginBottom: 20 }}>
            <Text style={styles.label}>{p.texto}</Text>
            <TouchableOpacity
              style={styles.uploadBotao}
              onPress={() => escolherImagem(p.id)}
            >
              <Text style={{ color: '#fff' }}>Anexar imagem</Text>
            </TouchableOpacity>
            {imagens[p.id] && (
              <Image
                source={{ uri: `data:image/jpeg;base64,${imagens[p.id]}` }}
                style={{ width: '100%', height: 200, marginTop: 10 }}
                resizeMode="cover"
              />
            )}
          </View>
        );
      })}

      <Button title="Gerar Documento" onPress={enviarFormulario} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  uploadBotao: {
    marginTop: 6,
    backgroundColor: '#4c6ef5',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  opcoesLinha: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  opcao: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginRight: 10,
  },
  opcaoSelecionada: {
    backgroundColor: '#d0eaff',
    borderColor: '#4c6ef5',
  },
});

export default PhotoReportScreen;
