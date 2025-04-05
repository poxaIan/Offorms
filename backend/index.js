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

app.get('/teste-imagem', (req, res) => {
  try {
    // 📁 Caminhos
    const templatePath = path.join(__dirname, 'templates', 'teste.docx');
    const outputPath = path.join('/tmp', 'relatorio_teste.docx');
    const imagemPath = path.join(__dirname, 'imagens', 'teste.png');

    // 📦 Lê e carrega o template
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    // 🧩 Configura o módulo de imagem
    const imageModule = new ImageModule({
      centered: false,
      getImage: () => fs.readFileSync(imagemPath),
      getSize: () => [400, 300],
    });

    // 📄 Prepara o docxtemplater
    const doc = new Docxtemplater(zip, {
      modules: [imageModule],
    });

    // ✍️ Dados para preenchimento
    doc.setData({
      teste: 'Texto preenchido com sucesso!',
      image: imagemPath, // esse será usado no {%image}
    });

    // 🧾 Gera o documento
    doc.render();
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    fs.writeFileSync(outputPath, buffer);
    ultimoRelatorioGerado = outputPath;

    res.download(outputPath, 'relatorio_teste.docx');
  } catch (error) {
    console.error('❌ Erro ao gerar documento:', error);
    res.status(500).send('Erro ao gerar o documento');
  }
});
