import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuth: false,

  setAuth: (user, accessToken) => set({ user, accessToken, isAuth: true }),
  setAccessToken: (accessToken) => set({ accessToken }),
  logout: () => set({ user: null, accessToken: null, isAuth: false }),
}))
