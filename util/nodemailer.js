const nodemailer = require('nodemailer');

//for mail.ru
const transporter = nodemailer.createTransport(
    {
      host: 'smtp.mail.ru',
      port: 465,
      secure: true,
      auth: {
        user: 'shaqe9301@mail.ru',
        pass: 'qanonmanon'
      }
    },
    {
      from : 'shaqe9301@mail.ru'
    }
  );
  
  
  //for gmail.com
  // const transporter = nodemailer.createTransport(
  //     {
  //         host: 'smtp.gmail.com',
  //         port: 587,
  //         secure: false,
  //         auth: {
  //             user: '<tshaqe@gmail.com>',
  //             pass: 'rimadavit0615238',
  //         }
  //     }, 
  //     {
  //         from: '<tshaqe@gmail.com>'
  //     }
  // )
  
module.exports = (message) => {
    transporter.sendMail(message, (err, info) => {
        if(err) return console.log(err);
        console.log('Email sent: ', info)
      })
}