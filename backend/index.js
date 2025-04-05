const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const ImageModule = require('docxtemplater-image-module-free');

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

let ultimoRelatorioGerado = '';

app.post('/gerar-relatorio', async (req, res) => {
  try {
    const { textos, imagens } = req.body;

    const templatePath = path.join(__dirname, 'templates', 'teste.docx');
    const content = fs.readFileSync(templatePath, 'binary');

    const zip = new PizZip(content);

    const imageModule = new ImageModule({
      getImage: (tag) => {
        const base64 = imagens[tag];
        if (!base64) throw new Error(`Imagem não encontrada para: ${tag}`);
        return Buffer.from(base64, 'base64');
      },
      getSize: () => [400, 300],
    });

    const doc = new Docxtemplater(zip, {
      modules: [imageModule],
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.setData({ ...textos, ...imagens });

    doc.render();

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    const outputPath = path.join('/tmp', 'relatorio_preenchido.docx');
    fs.writeFileSync(outputPath, buffer);
    ultimoRelatorioGerado = outputPath;

    res.json({ mensagem: 'Documento gerado com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao gerar o relatório:', error);
    res.status(500).json({ erro: 'Falha ao gerar relatório' });
  }
});

app.get('/download-relatorio', (req, res) => {
  if (fs.existsSync(ultimoRelatorioGerado)) {
    res.download(ultimoRelatorioGerado, 'relatorio.docx');
  } else {
    res.status(404).send('Nenhum relatório gerado ainda.');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
