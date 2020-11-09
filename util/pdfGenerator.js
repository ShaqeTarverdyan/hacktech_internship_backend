const PDFDocument = require('pdfkit');
const fs = require('fs');
const uuid = require('uuid')

module.exports = (fullSelectedNews) => {
    let pdfDoc = new PDFDocument;
    const pdfFileName = `public/uploads/${uuid.v4()}.pdf`
    pdfDoc.pipe(fs.createWriteStream(pdfFileName));
    fullSelectedNews.map(item => {
      pdfDoc
        .fontSize(8)
        .fillColor('blue')
        .text(
          item.title, 
          {oblique : true, width: 410, align: 'center'}
        );
      pdfDoc
        .fillColor('red')
        .text(item.content), {oblique : true, width: 410, align: 'left'};
      item.news_images.map(image => 
          pdfDoc
            .image(image.dataValues.path, {width: 150, height: 150, align: 'center'}))
      });
    pdfDoc.end();
    return pdfFileName;
  }