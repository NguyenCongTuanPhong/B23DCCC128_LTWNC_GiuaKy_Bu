import { configureStore } from '@reduxjs/toolkit'
import { registrationLimitMiddleware } from './registrationLimitMiddleware'
import workshopsReducer from '../features/workshops/workshopsSlice'
import type { WorkshopsState } from '../features/workshops/workshopsSlice'

export const store = configureStore({
  reducer: { workshops: workshopsReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(registrationLimitMiddleware),
})

export interface RootState {
  workshops: WorkshopsState
}

export type AppDispatch = typeof store.dispatch