import { getStorageData, removeStorageData, setStorageData, STORAGE_KEYS } from "@libs/storage";
import { useUserStore } from "@store/useUserStore";
import type { User } from "@typedef/UserType";
import { useCallback, useEffect } from "react";

export default function useUser() {
  const { user, setUser } = useUserStore()

  const updateUser = useCallback((user: User) => {
    setUser(user)
    setStorageData('LOCAL', STORAGE_KEYS.user, JSON.stringify(user))
  }, [])

  const flushUser = useCallback(() => {
    setUser(null)
    removeStorageData('LOCAL', STORAGE_KEYS.user)
  }, [])

  useEffect(() => {
    if (user) setStorageData('LOCAL', STORAGE_KEYS.user, JSON.stringify(user))
  }, [user])

  useEffect(() => {
    const saved = getStorageData('LOCAL', STORAGE_KEYS.user)

    const token = saved ? JSON.parse(saved) as User : null

    if (token) setUser(token)
    else setUser(null)
  }, [])

  return { user, updateUser, flushUser }
}