import { describe, expect, it } from 'vitest'
import type { Workshop } from '../../types/workshop'
import reducer, { loadWorkshops, registerWorkshop, unregisterWorkshop } from './workshopsSlice'

const sampleWorkshop: Workshop = {
  id: 'workshop-1', title: 'TypeScript thực chiến', speaker: 'Minh Anh', topic: 'Lập trình',
  date: '2026-11-12T08:30:00+07:00', availableSeats: 2, capacity: 5, description: 'Kiểu dữ liệu an toàn.',
}

describe('workshopsSlice reducer', () => {
  it('starts with an idle empty state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toMatchObject({ items: [], registeredIds: [], status: 'idle', error: null })
  })
  it('stores workshops when loading succeeds', () => {
    const state = reducer(undefined, loadWorkshops.fulfilled([sampleWorkshop], 'request-1', undefined))
    expect(state.status).toBe('succeeded')
    expect(state.items).toEqual([sampleWorkshop])
  })
  it('sets loading while the request is pending', () => {
    expect(reducer(undefined, loadWorkshops.pending('request-1', undefined)).status).toBe('loading')
  })
  it('stores an error when loading fails', () => {
    const state = reducer(undefined, loadWorkshops.rejected(null, 'request-1', undefined, 'API unavailable'))
    expect(state.status).toBe('failed')
    expect(state.error).toBe('API unavailable')
  })
  it('decreases a seat on registration and restores it on cancellation', () => {
    const loaded = reducer(undefined, loadWorkshops.fulfilled([sampleWorkshop], 'request-1', undefined))
    const registered = reducer(loaded, registerWorkshop(sampleWorkshop.id))
    expect(registered.items[0]?.availableSeats).toBe(1)
    expect(registered.registeredIds).toEqual([sampleWorkshop.id])
    const cancelled = reducer(registered, unregisterWorkshop(sampleWorkshop.id))
    expect(cancelled.items[0]?.availableSeats).toBe(2)
    expect(cancelled.registeredIds).toEqual([])
  })
  it('does not register a full workshop', () => {
    const fullWorkshop = { ...sampleWorkshop, availableSeats: 0 }
    const loaded = reducer(undefined, loadWorkshops.fulfilled([fullWorkshop], 'request-1', undefined))
    const nextState = reducer(loaded, registerWorkshop(fullWorkshop.id))
    expect(nextState.registeredIds).toEqual([])
    expect(nextState.items[0]?.availableSeats).toBe(0)
  })
})