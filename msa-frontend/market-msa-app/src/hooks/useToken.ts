import { useCallback, useEffect } from "react";
import { useTokenStore } from "@store/useTokenStore";
import { getStorageData, removeStorageData, setStorageData, STORAGE_KEYS } from "@libs/storage";
import type { Token } from "@typedef/TokenType";

export default function useToken() {
  const { token, setToken } = useTokenStore()

  const updateToken = useCallback((token: Token) => {
    setToken(token)
    setStorageData('LOCAL', STORAGE_KEYS.token, JSON.stringify(token))
  }, [])

  const flushToken = useCallback(() => {
    setToken(null)
    removeStorageData('LOCAL', STORAGE_KEYS.token)
  }, [])

  useEffect(() => {
    if (token) setStorageData('LOCAL', STORAGE_KEYS.token, JSON.stringify(token))
  }, [token])

  useEffect(() => {
    const saved = getStorageData('LOCAL', STORAGE_KEYS.token)

    const token = saved ? JSON.parse(saved) as Token : null

    if (token) setToken(token)
    else setToken(null)
  }, [])

  return { token, updateToken, flushToken }
}