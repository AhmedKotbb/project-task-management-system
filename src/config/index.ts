import dotenv from "dotenv";

class Configuration {
  private static instance: Configuration;

  public readonly port: number;
  public readonly dbUser: string;
  public readonly dbPassword: string;
  public readonly dbName: string;
  public readonly dbHost: string;

  private constructor() {
    dotenv.config();
    this.port = parseInt(process.env.PORT || "3000", 10);
    this.dbUser = process.env.DB_USER || "";
    this.dbPassword = process.env.DB_PASSWORD || "";
    this.dbName = process.env.DB_NAME || "";
    this.dbHost = process.env.DB_HOST || "";
  }

  public static getInstance(): Configuration {
    if (!Configuration.instance) {
      Configuration.instance = new Configuration();
    }
    return Configuration.instance;
  }
}

export default Configuration.getInstance();