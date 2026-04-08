import { create } from 'zustand'

type TasksUiState = {
    page: number
    limit: number
    isCreateModalOpen: boolean
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    openCreateModal: () => void
    closeCreateModal: () => void
}

export const useTasksUiStore = create<TasksUiState>(set => ({
    page: 1,
    limit: 10,
    isCreateModalOpen: false,
    setPage: page => set({ page }),
    setLimit: limit => set({ limit, page: 1 }),
    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),
}))
