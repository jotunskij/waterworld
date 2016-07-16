var nodemailer = require('nodemailer');
var secret = require('/home/pi/Repos/waterworld/secret');
var winston = require('winston');

var login = secret.gmail_user+':'+secret.gmail_pass;
var transporter = nodemailer.createTransport('smtps://'+login+'@smtp.gmail.com');

function createMailOptions(title, msg) {
  return {
    from: secret.from, // sender address
    to: secret.recipients, // list of receivers
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
