import type { User } from '@typedef/UserType';
import { create } from 'zustand';

interface UserState {
  user: User | null,
  setUser: (user: User | null) => void
}

export const useUserStore = create<UserState>((setUserFromStore) => ({
  user: null,
  setUser: (user) => setUserFromStore({ user: user })
}))