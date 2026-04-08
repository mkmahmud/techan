import { create } from 'zustand'

type AuditLogsUiState = {
    page: number
    limit: number
    selectedLogId: string | null
    isDetailsOpen: boolean
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    openDetails: (logId: string) => void
    closeDetails: () => void
}

export const useAuditLogsUiStore = create<AuditLogsUiState>(set => ({
    page: 1,
    limit: 10,
    selectedLogId: null,
    isDetailsOpen: false,
    setPage: page => set({ page }),
    setLimit: limit => set({ limit, page: 1 }),
    openDetails: logId => set({ isDetailsOpen: true, selectedLogId: logId }),
    closeDetails: () => set({ isDetailsOpen: false, selectedLogId: null }),
}))
