import nodemailer from "nodemailer";
import configConstants from "../config/constants";

export class NodemailerService {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: configConstants.SMTP_USER,
      pass: configConstants.SMTP_PASS,
    },
  });

  mailOptions = {
    from: configConstants.SMTP_USER,
    to: "",
    subject: "",
    text: "",
  };

  async sendMail(to: string, subject: string, text: string) {
    this.mailOptions.to = to;
    this.mailOptions.subject = subject;
    this.mailOptions.text = text;
    return this.transporter.sendMail(this.mailOptions);
  }
}
