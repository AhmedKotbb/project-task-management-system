import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { buildOpenApiSpec } from "./openapi";

export function setupSwagger(app: Express): void {
  const spec = buildOpenApiSpec();

  app.get("/docs/openapi.json", (_req: Request, res: Response) => {
    res.json(spec);
  });

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(spec, {
      customSiteTitle: "Task Management API Docs",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: "list",
        filter: true,
      },
    }),
  );
}
