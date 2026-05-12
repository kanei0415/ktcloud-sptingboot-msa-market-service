import type { Token } from '@typedef/TokenType';
import { create } from 'zustand';

interface TokenState {
  token: Token | null,
  setToken: (token: Token | null) => void
}

export const useTokenStore = create<TokenState>((setTokenFromStore) => ({
  token: null,
  setToken: (token) => setTokenFromStore({ token: token })
}))