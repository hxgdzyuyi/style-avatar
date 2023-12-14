import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const currentSlice = createSlice({
  name: 'allAccessories',
  initialState,
  reducers: {
    loadAllAccessories(state, action) {
      return action.payload
    },
  },
})

export const { loadAllAccessories } = currentSlice.actions
export default currentSlice.reducer
