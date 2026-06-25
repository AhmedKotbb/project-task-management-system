import { app } from "./app";
import config from "./config";
import database from "./database";

const port = config.port;

async function startServer(): Promise<void> {
  await database.connect();

  const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Swagger documentation is available at http://localhost:${port}/docs`);
  });

  const shutdown = async (signal: string) => {
    console.log(`${signal} received, shutting down gracefully...`);
    server.close(async () => {
      await database.disconnect();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});