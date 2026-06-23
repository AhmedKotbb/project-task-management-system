import nodemailer, { Transporter } from "nodemailer";
import config from "../config";
import { MailOptions } from "../interfaces/mail.interface";
import { APIError } from "./errors";

class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });
  }

  private async sendMail(options: MailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: config.emailFrom,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html ?? options.text,
      });
    } catch (error) {
      console.log(error);
      throw APIError.InternalServerError("Failed to send email");
    }
  }

  public async sendInitialPasswordEmail(
    to: string,
    password: string,
  ): Promise<void> {
    const object: MailOptions = {
      to,
      subject: "Initial password",
      text: `
      Welcome!
      Your account has been created. Use the temporary password below to sign in:
      ${password}
      Please change your password after your first login.
      `,
    };

    await this.sendMail(object);
  }
}

export default new MailService();