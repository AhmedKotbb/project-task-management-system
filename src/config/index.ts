import dotenv from "dotenv";

class Configuration {
  private static instance: Configuration;

  public readonly port: number;
  public readonly dbUser: string;
  public readonly dbPassword: string;
  public readonly dbName: string;
  public readonly dbHost: string;
  public readonly emailUser: string;
  public readonly emailPassword: string;
  public readonly emailFrom: string;

  private constructor() {
    dotenv.config();
    this.port = parseInt(process.env.PORT || "3000", 10);
    this.dbUser = process.env.DB_USER || "";
    this.dbPassword = process.env.DB_PASSWORD || "";
    this.dbName = process.env.DB_NAME || "";
    this.dbHost = process.env.DB_HOST || "";
    this.emailUser = process.env.EMAIL_USER || "";
    this.emailPassword = process.env.EMAIL_PASS || "";
    this.emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER || "";
  }

  public static getInstance(): Configuration {
    if (!Configuration.instance) {
      Configuration.instance = new Configuration();
    }
    return Configuration.instance;
  }
}

export default Configuration.getInstance();