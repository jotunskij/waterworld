var nodemailer = require('nodemailer');
var secret = require('/home/pi/Repos/waterworld/secret');
var winston = require('winston');

var transporter = nodemailer.createTransport('smtps://'+secret.gmail_user+':'+secret.gmail_pass+'@smtp.gmail.com');

function createMailOptions(title, msg) {
  return {
    from: '"Bevattning" <svuzzigastebuzzen@gmail.com>', // sender address
    to: 'jens.tinglev@gmail.com', // list of receivers
    subject: title, // Subject line
    text: msg, // plaintext body
    html: '<b>' + msg + '</b>' // html body
  };
}

module.exports = {

  sendWaterMail: function () {
    var mailOptions = createMailOptions('Bevattning startad', 'Nu vattnas det');

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        winston.error('Error sending mail: ' + error);
        return;
      }
      winston.info('Mail sent for watering');
    });
  },

  sendPressureWarningMail: function () {
    var mailOptions = createMailOptions('VARNING!', 'Tryckfall upptäckt!');

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        winston.error('Error sending mail: ' + error);
        return;
      }
      winston.info('Mail sent for pressure warning');
    });
  }

};
