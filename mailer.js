/**
 * Created by tinglev on 10/07/16.
 */

var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://svuzzigastebuzzen%40gmail.com:Alizia2003!@smtp.gmail.com');

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
        return console.log('Error sending mail: ' + error);
      }
      console.log('Message sent: ' + info.response);
    });
  },

  sendOverflowMail: function () {
    var mailOptions = createMailOptions('VARNING!', 'Tryckfall upptäckt!');

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log('Error sending mail: ' + error);
      }
      console.log('Message sent: ' + info.response);
    });
  }

};
