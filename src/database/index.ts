import { Sequelize } from "sequelize";
import config from "../config";
import { User } from "./models/user.model";

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
    try {
      User.initialize(this.sequelize);


      await this.sequelize.authenticate();
      await this.sequelize.sync({ force: false });
      console.log("Connection has been established successfully!");
    } catch (error) {
      console.log("Unable to connect to the database:", error);
    }
  }

  public async disconnect(): Promise<void> {
    await this.sequelize.close();
    console.log("Database connection has been closed.");
  }
}

export default Database.getInstance();
