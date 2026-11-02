import { configureStore } from '@reduxjs/toolkit'
import { describe, expect, it } from 'vitest'
import type { Workshop } from '../types/workshop'
import { registrationLimitMiddleware } from './registrationLimitMiddleware'
import workshopsReducer, { registerWorkshop } from '../features/workshops/workshopsSlice'

const workshop: Workshop = {
  id: 'workshop-1', title: 'Workshop kiểm thử', speaker: 'Minh Anh', topic: 'Lập trình',
  date: '2026-11-12T08:30:00+07:00', availableSeats: 4, capacity: 10, description: 'Kiểm tra giới hạn.',
}

describe('registrationLimitMiddleware', () => {
  it('blocks a fourth registration and sets a warning', () => {
    const items = ['workshop-1', 'workshop-2', 'workshop-3', 'workshop-4'].map((id) => ({ ...workshop, id }))
    const store = configureStore({
      reducer: { workshops: workshopsReducer },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(registrationLimitMiddleware),
      preloadedState: {
        workshops: {
          items,
          registeredIds: ['workshop-1', 'workshop-2', 'workshop-3'],
          status: 'succeeded' as const,
          error: null,
          registrationWarning: null,
        },
      },
    })

    store.dispatch(registerWorkshop('workshop-4'))

    expect(store.getState().workshops.registeredIds).toHaveLength(3)
    expect(store.getState().workshops.items[3]?.availableSeats).toBe(4)
    expect(store.getState().workshops.registrationWarning).toMatch(/tối đa 3 workshop/)
  })
})