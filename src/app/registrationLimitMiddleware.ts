import type { Middleware } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { registerWorkshop, setRegistrationWarning } from '../features/workshops/workshopsSlice'

export const registrationLimitMiddleware: Middleware<{}, RootState> =
  ({ getState, dispatch }) =>
    (next) =>
      (action) => {
        if (registerWorkshop.match(action)) {
          const { registeredIds } = getState().workshops
          if (!registeredIds.includes(action.payload) && registeredIds.length >= 3) {
            dispatch(setRegistrationWarning('Bạn chỉ có thể đăng ký tối đa 3 workshop cùng lúc.'))
            return action
          }
        }

        return next(action)
      }