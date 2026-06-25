import j2s from "joi-to-swagger";
import { ObjectSchema } from "joi";

export function joiToOpenApiSchema(schema: ObjectSchema) {
  const { swagger } = j2s(schema);
  return swagger;
}

export function joiToQueryParameters(schema: ObjectSchema) {
  const { swagger } = j2s(schema);
  if (!swagger.properties) return [];

  return Object.entries(swagger.properties).map(([name, prop]) => {
    const property = prop as Record<string, unknown>;
    return {
      name,
      in: "query" as const,
      required: swagger.required?.includes(name) ?? false,
      schema: property,
      ...(property.default !== undefined && { example: property.default }),
    };
  });
}

export function joiToPathParameters(schema: ObjectSchema) {
  const { swagger } = j2s(schema);
  if (!swagger.properties) return [];

  return Object.entries(swagger.properties).map(([name, prop]) => ({
    name,
    in: "path" as const,
    required: true,
    schema: prop,
  }));
}

export function joiRequestBody(schema: ObjectSchema, description?: string) {
  return {
    required: true,
    content: {
      "application/json": {
        schema: joiToOpenApiSchema(schema),
      },
    },
    ...(description && { description }),
  };
}

export function errorResponse(
  description: string,
  statusCode: number,
  statusText: string,
  message: string,
) {
  return {
    description,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorResponse" },
        example: { statusCode, statusText, message },
      },
    },
  };
}

export function successResponse(
  statusCode: number,
  description: string,
  dataSchema: Record<string, unknown> | { $ref: string },
  message: string,
  dataExample: unknown,
) {
  return {
    description,
    content: {
      "application/json": {
        schema: {
          allOf: [
            { $ref: "#/components/schemas/ApiSuccessResponse" },
            {
              type: "object",
              properties: { data: dataSchema },
            },
          ],
        },
        example: {
          statusCode,
          message,
          data: dataExample,
          timestamp: "2026-6-25 10:30:45",
        },
      },
    },
  };
}

export function emptySuccessResponse(
  statusCode: number,
  description: string,
  message: string,
) {
  return successResponse(statusCode, description, { type: "object" }, message, {});
}
