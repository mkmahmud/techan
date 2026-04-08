import { create } from 'zustand'

type UsersUiState = {
    page: number
    limit: number
    isCreateModalOpen: boolean
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    openCreateModal: () => void
    closeCreateModal: () => void
}

export const useUsersUiStore = create<UsersUiState>(set => ({
    page: 1,
    limit: 20,
    isCreateModalOpen: false,
    setPage: page => set({ page }),
    setLimit: limit => set({ limit, page: 1 }),
    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),
}))
