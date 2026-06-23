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
  public readonly jwtAccessSecret: string;
  public readonly jwtAccessExpiresIn: string;
  public readonly jwtRefreshSecret: string;
  public readonly jwtRefreshExpiresIn: string;

  private constructor() {
    dotenv.config();
    this.port = parseInt(process.env.PORT || "3000", 10);
    this.dbUser = process.env.DB_USER || "";
    this.dbPassword = process.env.DB_PASSWORD || "";
    this.dbName = process.env.DB_NAME || "";
    this.dbHost = process.env.DB_HOST || "";
    // Email
    this.emailUser = process.env.EMAIL_USER || "";
    this.emailPassword = process.env.EMAIL_PASS || "";
    // JWT
    this.jwtAccessSecret = process.env.JWT_ACCESS_SECRET || "";
    this.jwtAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "";
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || "";
    this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "";
  }

  public static getInstance(): Configuration {
    if (!Configuration.instance) {
      Configuration.instance = new Configuration();
    }
    return Configuration.instance;
  }
}

export default Configuration.getInstance();