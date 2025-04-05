const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const ImageModule = require('docxtemplater-image-module-free');

const templatePath = path.join(__dirname, 'templates', 'teste.docx');
const outputPath = path.join('/tmp', 'relatorio_preenchido.docx');

const imageModule = new ImageModule({
  getImage: (tag) => {
    const base64 = imagens[tag]; // Suponha que isso venha do seu `req.body.imagens`
    if (!base64) throw new Error(`Imagem não encontrada para: ${tag}`);
    return Buffer.from(base64, 'base64');
  },
  getSize: () => [400, 300],
});

const content = fs.readFileSync(templatePath, 'binary');
const zip = new PizZip(content);

const doc = new Docxtemplater(zip, {
  modules: [imageModule],
  paragraphLoop: true,
  linebreaks: true,
});

// Agora em vez de setData(), usamos diretamente:
doc.render({
  teste: 'Texto preenchido via render()',
  image: path.join(__dirname, 'img.png') // ou imagem base64 se vier do app
});

const buffer = doc.getZip().generate({ type: 'nodebuffer' });
fs.writeFileSync(outputPath, buffer);
