import {
  STORAGE_KEYS,
  getStorageData,
  setStorageData,
  removeStorageData,
} from '@libs/storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('LOCAL', () => {
    it('writes and reads from localStorage', () => {
      setStorageData('LOCAL', STORAGE_KEYS.token, 'jwt-value');
      expect(getStorageData('LOCAL', STORAGE_KEYS.token)).toBe('jwt-value');
      expect(localStorage.getItem(STORAGE_KEYS.token)).toBe('jwt-value');
    });

    it('does not leak into sessionStorage', () => {
      setStorageData('LOCAL', STORAGE_KEYS.token, 'jwt-value');
      expect(sessionStorage.getItem(STORAGE_KEYS.token)).toBeNull();
    });

    it('remove clears the key', () => {
      setStorageData('LOCAL', STORAGE_KEYS.user, '{"id":"u1"}');
      removeStorageData('LOCAL', STORAGE_KEYS.user);
      expect(getStorageData('LOCAL', STORAGE_KEYS.user)).toBeNull();
    });
  });

  describe('SESSION', () => {
    it('writes and reads from sessionStorage', () => {
      setStorageData('SESSION', STORAGE_KEYS.user, '{"id":"u1"}');
      expect(getStorageData('SESSION', STORAGE_KEYS.user)).toBe('{"id":"u1"}');
      expect(sessionStorage.getItem(STORAGE_KEYS.user)).toBe('{"id":"u1"}');
    });

    it('does not leak into localStorage', () => {
      setStorageData('SESSION', STORAGE_KEYS.user, '{"id":"u1"}');
      expect(localStorage.getItem(STORAGE_KEYS.user)).toBeNull();
    });
  });

  it('returns null for unknown keys', () => {
    expect(getStorageData('LOCAL', STORAGE_KEYS.token)).toBeNull();
    expect(getStorageData('SESSION', STORAGE_KEYS.user)).toBeNull();
  });
});
