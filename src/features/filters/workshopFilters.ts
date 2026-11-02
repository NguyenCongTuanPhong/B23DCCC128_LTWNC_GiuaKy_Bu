import { create } from 'zustand'
import type { WorkshopTopic } from '../../types/workshop'

export type TopicFilter = WorkshopTopic | 'Tất cả'

interface WorkshopFilterState {
  search: string
  topic: TopicFilter
  setSearch: (search: string) => void
  setTopic: (topic: TopicFilter) => void
}

export const useWorkshopFilters = create<WorkshopFilterState>((set) => ({
  search: '',
  topic: 'Tất cả',
  setSearch: (search) => set({ search }),
  setTopic: (topic) => set({ topic }),
}))