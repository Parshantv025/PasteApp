import { createSlice } from '@reduxjs/toolkit'

export const pasteSlice = createSlice({
  name: 'paste',
  initialState: {
    pastes: localStorage.getItem('pastes') ? JSON.parse(localStorage.getItem('pastes')) : []
  },
  reducers: {
    addToPastes: (state, action) => {
      state.pastes.push(action.payload);
      localStorage.setItem("pastes", JSON.stringify(state.pastes));
    },
    updateToPastes: (state, action) => {
      const pasteIndex = state.pastes.findIndex((paste) => paste._id === action.payload._id)
      if (pasteIndex !== -1) {
        state.pastes[pasteIndex] = action.payload
      }
      localStorage.setItem("pastes", JSON.stringify(state.pastes));
    },
    resetAllPastes: (state) => {
      state.pastes = []
      localStorage.setItem("pastes", JSON.stringify(state.pastes));
    },
    removeFromPastes: (state, action) => {
      state.pastes = state.pastes.filter((paste) => paste._id !== action.payload)
      localStorage.setItem("pastes", JSON.stringify(state.pastes));
    },
  }
})

export const { addToPastes, updateToPastes, resetAllPastes, removeFromPastes } = pasteSlice.actions

export default pasteSlice.reducer