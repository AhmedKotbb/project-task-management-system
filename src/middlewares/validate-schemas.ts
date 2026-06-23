import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { APIError } from "../utilities/errors";

export const validateSchemas =
  (
    schema: ObjectSchema,
    type: "body" | "query" | "params" | "headers" = "body",
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[type], {
      abortEarly: false,
      convert: true,
    });

    if (error) {
      const message = error.details
        .map((d) => d.message.replace(/['"]+/g, ""))
        .join(",");

      return next(
        APIError.BadRequest(
          message || "Invalid data, Please review.",
        ),
      );
    }

    if (type === "query") {
      Object.assign(req.query, value);
    } else {
      (req as any)[type] = value;
    }

    next();
  };