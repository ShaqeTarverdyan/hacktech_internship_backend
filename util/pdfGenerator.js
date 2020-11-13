const PDFDocument = require('pdfkit');
const fs = require('fs');
const uuid = require('uuid')

module.exports = (fullSelectedNews) => {
    let pdfDoc = new PDFDocument;
    const pdfFileName = `public/uploads/${uuid.v4()}.pdf`
    pdfDoc.pipe(fs.createWriteStream(pdfFileName));
    fullSelectedNews.map(item => {
      pdfDoc
        .fontSize(18)
        .fillColor('black')
        .text(
          item.title, 
          { width: 410, align: 'center'}
        );
      item.news_images.map(image => 
        pdfDoc
        .image(image.dataValues.path, {width: 80, height: 80, valign:'top', align: 'left', float: 'left'})
      )
      pdfDoc
        .fillColor('grey')
        .fontSize(13)
        .text(item.content), {
          paragraphGap: 10,
          indent: 20,
          align: 'justify',
          columns: 2
        };
      });
    pdfDoc.end();
    return pdfFileName;
  }

