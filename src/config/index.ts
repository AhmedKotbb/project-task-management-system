import dotenv from "dotenv";

class Configuration {
  private static instance: Configuration;
  
  public readonly port: number;

  private constructor() {
    dotenv.config();
    this.port = parseInt(process.env.PORT || "3000");

  }

  public static getInstance(): Configuration {
    if (!Configuration.instance) {
      Configuration.instance = new Configuration();
    }
    return Configuration.instance;
  }
}

export default Configuration.getInstance();