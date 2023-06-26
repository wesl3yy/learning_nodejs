const { GeneralError, GeneralMessage } = require("../common/general");


class MailServices {
  constructor(configServices, nodeMailer) {
    this.configServices = configServices;
    const { service, user, pass } = configServices.getEmailConfig();
    const transporter = nodeMailer.createTransport({
      service,
      auth: { user, pass }
    });
    this.nodeMailer = transporter;
  }

  async send(to, subject, text) {
    const mailOptions = {
      from: this.configServices.getEmailConfig().user,
      to,
      subject,
      text
    };
    this.nodeMailer.sendMail(mailOptions, (error) => {
      if (error) {
        return { message: GeneralError.EmailSentError };
      }
      return { message: GeneralMessage.EmailSent };
    })
  }
}

module.exports = MailServices;