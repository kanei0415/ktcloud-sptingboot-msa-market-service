import type { Token } from "@typedef/TokenType";
import type { User } from "@typedef/UserType";

export interface SignInResponse {
  user: User,
  token: Token
}

export interface CheckValidityResponse {
  user: User
}