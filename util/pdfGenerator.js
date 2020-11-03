const PDFDocument = require('pdfkit');
const fs = require('fs');
const uuid = require('uuid')

module.exports = (fullSelectedNews) => {

    let pdfDoc = new PDFDocument;
    const pdfFileName = `public/uploads/${uuid.v4()}.pdf`
    pdfDoc.pipe(fs.createWriteStream(pdfFileName));
    fullSelectedNews.map(item => {
      pdfDoc
        .fillColor('blue')
        .text(item.title, {oblique : true, lineBreak : false});
      pdfDoc
        .fillColor('red')
        .text(item.content);
      item.images.map(image => 
          pdfDoc
            .image(image.dataValues.path, {width: 150, height: 150, align: 'center'}))
    });
    pdfDoc.end();
    return pdfFileName;
  }