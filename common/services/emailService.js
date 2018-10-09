'use strict';

let nodemailer = require('nodemailer');

module.exports.sendEmail = (email, assunto, mensagem) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sensebit2018@gmail.com',
      pass: 'fglt2018',
    },
  });

  const mailOptions = {
    from: 'sensebit2018@gmail.com', // sender address
    to: email, // list of receivers
    subject: assunto, // Subject line
    html: mensagem, // plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};
