import AuthRestApi from '@libs/rest-api/auth/auth-rest-api';
import type { SignInRequest, SignUpRequest } from '@libs/rest-api/auth/request';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@store/useAuthStore';
import { authKeys } from '@libs/query-keys';

export function useSignIn() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SignInRequest) => AuthRestApi.signIn(request),
    onSuccess: (response) => {
      setAuth({ token: response.token, user: response.user });
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: (request: SignUpRequest) => AuthRestApi.signUp(request),
  });
}

export function useSignOut() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return () => {
    clearAuth();
    queryClient.clear();
  };
}
