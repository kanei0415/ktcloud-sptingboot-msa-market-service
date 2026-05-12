import AuthRestApi from "@libs/rest-api/auth/auth-rest-api";
import type { SignInRequest, SignUpRequest } from "@libs/rest-api/auth/request";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import useToken from "../../hooks/useToken";
import useUser from "../../hooks/useUser";
import { ROUTE_PATHS } from "@libs/route-config";

const useSignIn = () => {
  const { updateToken, flushToken } = useToken()
  const { updateUser, flushUser } = useUser()

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (request: SignInRequest) => AuthRestApi.signIn(request),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['token', 'user'] })
      flushToken()
      flushUser()

      updateToken(response.token)
      updateUser(response.user)

      navigate({ to: ROUTE_PATHS.products } as any)
    }
  })
}

const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (request: SignUpRequest) => AuthRestApi.signUp(request),
    onSuccess: () => {
      navigate({ to: ROUTE_PATHS.signIn } as any)
      alert('로그인 해주세요')
    }
  })
}

const AuthService = { useSignIn, useSignUp }

export default AuthService