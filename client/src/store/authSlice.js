import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuth: false,
  isLoading: true, // true until tryRefresh resolves

  setAuth: (user, accessToken) => set({ user, accessToken, isAuth: true, isLoading: false }),
  setAccessToken: (accessToken) => set({ accessToken }),
  logout: () => set({ user: null, accessToken: null, isAuth: false, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}))
