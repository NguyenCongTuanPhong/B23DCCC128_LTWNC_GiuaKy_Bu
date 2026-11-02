import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchWorkshops } from '../../api/workshopsApi'
import { isApiSuccess, type Workshop } from '../../types/workshop'

export type WorkshopsStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface WorkshopsState {
  items: Workshop[]
  registeredIds: string[]
  status: WorkshopsStatus
  error: string | null
  registrationWarning: string | null
}

const initialState: WorkshopsState = {
  items: [], registeredIds: [], status: 'idle', error: null, registrationWarning: null,
}

export const loadWorkshops = createAsyncThunk<Workshop[], boolean | undefined, { rejectValue: string }>(
  'workshops/load',
  async (simulateFailure = false, { rejectWithValue }) => {
    const result = await fetchWorkshops(simulateFailure)
    if (!isApiSuccess(result)) return rejectWithValue(result.error)
    return result.data
  },
  {
    condition: (_, { getState }) => {
      const { status } = (getState() as { workshops: WorkshopsState }).workshops
      return status === 'idle' || status === 'failed'
    },
  },
)

const workshopsSlice = createSlice({
  name: 'workshops',
  initialState,
  reducers: {
    registerWorkshop(state, action: PayloadAction<string>) {
      const workshop = state.items.find((item) => item.id === action.payload)
      if (!workshop || workshop.availableSeats <= 0 || state.registeredIds.includes(action.payload)) return
      workshop.availableSeats -= 1
      state.registeredIds.push(action.payload)
      state.registrationWarning = null
    },
    unregisterWorkshop(state, action: PayloadAction<string>) {
      const registrationIndex = state.registeredIds.indexOf(action.payload)
      if (registrationIndex < 0) return
      state.registeredIds.splice(registrationIndex, 1)
      const workshop = state.items.find((item) => item.id === action.payload)
      if (workshop) workshop.availableSeats = Math.min(workshop.capacity, workshop.availableSeats + 1)
      state.registrationWarning = null
    },
    setRegistrationWarning(state, action: PayloadAction<string>) {
      state.registrationWarning = action.payload
    },
    clearRegistrationWarning(state) {
      state.registrationWarning = null
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadWorkshops.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadWorkshops.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadWorkshops.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Đã có lỗi xảy ra khi tải workshop.'
      })
  },
})

export const { registerWorkshop, unregisterWorkshop, setRegistrationWarning, clearRegistrationWarning } = workshopsSlice.actions
export default workshopsSlice.reducer