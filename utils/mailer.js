var nodemailer = require('nodemailer');


// Mail configuration which is used by node-mailer to send verification and pssword reset mails.

var smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'support@nextazy.com',
    pass: 'support@123',
  },
});

module.exports = smtpTransport;
