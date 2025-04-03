import { Alert, Linking } from 'react-native';

export async function gerarRelatorio(textos: object) {
  try {
    const response = await fetch('https://offorms.onrender.com/gerar-relatorio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ textos }),
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar relatório');
    }

    Alert.alert(
      'Relatório gerado!',
      'Clique para baixar o relatório.',
      [
        {
          text: 'Baixar',
          onPress: () => Linking.openURL('https://offorms.onrender.com/download-relatorio'),
        },
      ]
    );
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    Alert.alert('Erro', 'Não foi possível gerar o relatório.');
  }
}
