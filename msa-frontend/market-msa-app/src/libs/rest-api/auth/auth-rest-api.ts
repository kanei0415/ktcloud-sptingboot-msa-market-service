import api from "../rest-config";
import type { SignInRequest, SignUpRequest } from "./request";
import type { CheckValidityResponse, SignInResponse } from "./response";

const AUTH_API_ENDPOINT = `/auth`

const AUTH_API_RESOURCES = {
  checkValidity: `${AUTH_API_ENDPOINT}/check`,
  signIn: `${AUTH_API_ENDPOINT}/signin`,
  signUp: `${AUTH_API_ENDPOINT}/signup`,
}

async function checkValidity(accessToken: string): Promise<CheckValidityResponse> {
  const response = await api.get<CheckValidityResponse>(AUTH_API_RESOURCES.checkValidity, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response.data
}

async function signIn(request: SignInRequest): Promise<SignInResponse> {
  const response = await api.post<SignInResponse>(AUTH_API_RESOURCES.signIn, request)

  return response.data
}

async function signUp(request: SignUpRequest) {
  await api.post<SignInResponse>(AUTH_API_RESOURCES.signUp, request)
}

const AuthRestApi = { checkValidity, signIn, signUp }

export default AuthRestApi