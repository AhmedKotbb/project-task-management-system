export interface TokenPayload {
  id: string;
  role: "admin" | "member";
  email: string;
}

// export interface RefreshTokenRequest {
//   shouldClearRefreshToken?: boolean;
// }