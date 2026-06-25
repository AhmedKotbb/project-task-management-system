export const securitySchemes = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description:
      "JWT access token obtained from the login or refresh-token endpoints. Pass as `Authorization: Bearer <token>`.",
  },
  refreshCookie: {
    type: "apiKey",
    in: "cookie",
    name: "refreshToken",
    description:
      "HttpOnly refresh token cookie set automatically on login and refresh-token responses.",
  },
};
