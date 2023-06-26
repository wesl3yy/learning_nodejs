const { GeneralError, GeneralMessage } = require("../common/general");


class MailServices {
  constructor(configServices, NodeMailer) {
    this.configServices = configServices;
    const { service, user, pass } = configServices.getEmailConfig();
    const transporter = NodeMailer.createTransport({
      service,
      auth: { user, pass }
    });
    this.transporter = transporter;
  }

  async send(to, subject, text) {
    const mailOptions = {
      from: this.configServices.getEmailConfig().user,
      to,
      subject,
      text
    };
    this.transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return { message: GeneralError.EmailSentError };
      }
      return { message: GeneralMessage.EmailSent };
    })
  }
}

module.exports = MailServices;