// backend/index.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { createReport } = require('docx-templates');

const app = express();
const PORT = 3333;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/gerar-relatorio', async (req, res) => {
  try {
    const { textos, imagens } = req.body; // textos: { nome, data, ... }, imagens: { "imagem 1": base64, ... }

    const templatePath = path.join(__dirname, 'templates', 'fotografico.docx');
    const template = fs.readFileSync(templatePath);

    // Monta o objeto de substituição com textos e imagens
    const data = {
      ...textos,
      ...Object.fromEntries(
        Object.entries(imagens).map(([chave, base64]) => [
          chave,
          {
            width: 600,
            height: 340,
            data: Buffer.from(base64, 'base64'),
            extension: '.jpeg',
          },
        ])
      ),
    };

    const buffer = await createReport({ template, data });

    // ⬇️ Usa /tmp como diretório de saída no Render
    const outputPath = path.join('/tmp', 'relatorio_preenchido.docx');
    fs.writeFileSync(outputPath, buffer);

    res.json({
      filename: 'relatorio_preenchido.docx',
      base64: buffer.toString('base64'),
    });
  } catch (error) {
    console.error('Erro ao gerar o relatório:', error);
    res.status(500).json({ erro: 'Erro ao gerar o documento.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
