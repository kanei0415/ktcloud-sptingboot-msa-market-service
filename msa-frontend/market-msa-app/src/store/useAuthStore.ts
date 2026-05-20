import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Token } from '@typedef/TokenType';
import type { User } from '@typedef/UserType';

interface AuthState {
  token: Token | null;
  user: User | null;
  setAuth: (auth: { token: Token; user: User }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: ({ token, user }) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: '@market-msa-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);

export const selectToken = (s: AuthState) => s.token;
export const selectUser = (s: AuthState) => s.user;
export const selectIsAuthenticated = (s: AuthState) => s.token !== null;
export const selectSetAuth = (s: AuthState) => s.setAuth;
export const selectClearAuth = (s: AuthState) => s.clearAuth;
