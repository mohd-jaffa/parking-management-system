import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
    },
    restoreAuth(state, action) {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
    },
    logout(state) {
      state.token = null
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { loginSuccess, restoreAuth, logout } = authSlice.actions
export default authSlice.reducer
