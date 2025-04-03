// backend/index.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { createReport } = require('docx-templates');

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

let ultimoRelatorioGerado = ''; // guarda caminho do último relatório

app.post('/gerar-relatorio', async (req, res) => {
  console.log('📡 Requisição recebida no backend!');
  console.log('🔧 Usando valor fixo: { teste: "Ian" }');

  try {
    const templatePath = path.join(__dirname, 'templates', 'teste.docx');
    const template = fs.readFileSync(templatePath);

    // 👇 Valor fixo, ignora o corpo da requisição
    const data = {
      teste: 'Ian',
    };

    const buffer = await createReport({ template, data });

    const outputPath = path.join('/tmp', 'relatorio_preenchido.docx');
    fs.writeFileSync(outputPath, buffer);
    ultimoRelatorioGerado = outputPath;

    console.log('✅ Relatório salvo em /tmp');
    res.json({ mensagem: 'Relatório gerado com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao gerar o relatório:', error);
    res.status(500).json({ erro: 'Erro ao gerar o relatório.' });
  }
});

app.get('/download-relatorio', (req, res) => {
  if (fs.existsSync(ultimoRelatorioGerado)) {
    res.download(ultimoRelatorioGerado, 'relatorio_preenchido.docx');
  } else {
    res.status(404).send('Relatório ainda não foi gerado.');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
