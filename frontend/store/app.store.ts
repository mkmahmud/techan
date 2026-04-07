import { create } from 'zustand'

type AppState = {
    isGlobalLoading: boolean
    setGlobalLoading: (value: boolean) => void
}

export const useAppStore = create<AppState>(set => ({
    isGlobalLoading: false,
    setGlobalLoading: value => set({ isGlobalLoading: value }),
}))
