import { errorResponse } from "../helpers";

export const commonResponses = {
  BadRequest: errorResponse(
    "Invalid request data or business rule violation",
    400,
    "Bad Request",
    "Invalid data, Please review.",
  ),
  Unauthorized: errorResponse(
    "Missing or invalid authentication credentials",
    401,
    "Unauthorized",
    "Invalid or expired access token",
  ),
  Forbidden: errorResponse(
    "Authenticated but not authorized for this action",
    403,
    "Forbidden",
    "You are not authorized to do this action",
  ),
  NotFound: errorResponse(
    "Requested resource does not exist",
    404,
    "Not Found",
    "The resource you are looking for was not found.",
  ),
  InternalServerError: errorResponse(
    "Unexpected server error",
    500,
    "Internal Server Error",
    "An unexpected error occurred on the server.",
  ),
};
