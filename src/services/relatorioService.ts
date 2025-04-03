import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { Alert } from 'react-native';
import { Buffer } from 'buffer';

export async function gerarRelatorio(textos: object, imagens: object) {
  try {
    const response = await fetch('https://offorms.onrender.com/gerar-relatorio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ textos, imagens }),
    });

    if (!response.ok) {
      console.error('Erro HTTP do servidor:', response.status);
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const json = await response.json();
    console.log('Resposta completa do backend:', json);

    if (!json || !json.filename || !json.base64) {
      console.warn('Resposta malformada recebida:', json);
      Alert.alert('Erro', 'A resposta do servidor não está no formato esperado.');
      return;
    }

    const path = `${RNFS.DocumentDirectoryPath}/${json.filename}`;
    console.log('Salvando arquivo em:', path);

    const buffer = Buffer.from(json.base64, 'base64');
    await RNFS.writeFile(path, buffer.toString('base64'), 'base64');

    await FileViewer.open(path);
  } catch (error) {
    console.error('Erro ao abrir documento:', error);
    Alert.alert('Erro', 'Não foi possível abrir o relatório.');
  }
}
