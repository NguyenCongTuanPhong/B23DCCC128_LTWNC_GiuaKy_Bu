export const WORKSHOP_TOPICS = ['Lập trình', 'AI', 'Kỹ năng mềm'] as const

export type WorkshopTopic = (typeof WORKSHOP_TOPICS)[number]

export interface Workshop {
  id: string
  title: string
  speaker: string
  topic: WorkshopTopic
  date: string
  availableSeats: number
  capacity: number
  description: string
}

export type WorkshopSummary = Pick<Workshop, 'id' | 'title' | 'speaker' | 'topic'>
export type WorkshopDraft = Omit<Workshop, 'id'>

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

export function isApiSuccess<T>(result: ApiResult<T>): result is { ok: true; data: T } {
  return result.ok
}