import {
  useAuthStore,
  selectIsAuthenticated,
  selectToken,
  selectUser,
} from '@store/useAuthStore';
import type { Token } from '@typedef/TokenType';
import type { User } from '@typedef/UserType';

const TOKEN: Token = { accessToken: 'a.b.c', refreshToken: 'r.s.t' };
const USER: User = { id: 'u1', role: 'admin', email: 'u1@example.com', name: 'User One' };

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ token: null, user: null });
  });

  it('starts unauthenticated', () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(selectIsAuthenticated(state)).toBe(false);
  });

  it('setAuth stores token and user', () => {
    useAuthStore.getState().setAuth({ token: TOKEN, user: USER });

    const state = useAuthStore.getState();
    expect(selectToken(state)).toEqual(TOKEN);
    expect(selectUser(state)).toEqual(USER);
    expect(selectIsAuthenticated(state)).toBe(true);
  });

  it('clearAuth wipes token and user', () => {
    useAuthStore.getState().setAuth({ token: TOKEN, user: USER });
    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(selectIsAuthenticated(state)).toBe(false);
  });

  it('persists token and user to localStorage under "@market-msa-auth"', () => {
    useAuthStore.getState().setAuth({ token: TOKEN, user: USER });

    const raw = localStorage.getItem('@market-msa-auth');
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw as string);
    expect(parsed.state.token).toEqual(TOKEN);
    expect(parsed.state.user).toEqual(USER);
  });
});
