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

app.get('/teste-imagem', (req, res) => {
  try {
    // Caminho do template
    const templatePath = path.join(__dirname, 'templates', 'teste.docx');
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    // Configuração do módulo de imagem
    const imageModule = new ImageModule({
      getImage: (tag) => {
        if (tag === 'image') {
          const imagePath = path.join(__dirname, 'imagens', 'teste.png');
          return fs.readFileSync(imagePath);
        }
        throw new Error(`Imagem para tag ${tag} não encontrada`);
      },
      getSize: () => [400, 300],
    });

    const doc = new Docxtemplater(zip, {
      modules: [imageModule],
    });

    // Dados para preencher o documento
    doc.setData({
      teste: 'Texto inserido com sucesso!',
      image: 'image' // o nome da tag de imagem
    });

    doc.render();

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    const outputPath = path.join('/tmp', 'teste_completo.docx');
    fs.writeFileSync(outputPath, buffer);

    res.download(outputPath, 'teste_completo.docx');
  } catch (err) {
    console.error('Erro ao gerar documento:', err);
    res.status(500).send('Erro ao gerar documento');
  }
});
