import { Sequelize } from "sequelize";
import config from "../config";

class Database {
  private static instance: Database;

  public readonly sequelize: Sequelize;

  private constructor() {
    this.sequelize = new Sequelize({
      database: config.dbName,
      username: config.dbUser,
      password: config.dbPassword,
      host: config.dbHost,
      dialect: "postgres",
      logging: (msg) => {
        if (msg.toLowerCase().includes("error")) {
          console.error(msg); // Log only errors
        }
      },
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    await this.sequelize.authenticate();
    console.log("PostgreSQL connection established successfully.");
  }

  public async disconnect(): Promise<void> {
    await this.sequelize.close();
    console.log("PostgreSQL connection closed.");
  }
}

export default Database.getInstance();
