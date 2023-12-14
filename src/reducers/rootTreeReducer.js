import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const currentSlice = createSlice({
  name: 'rootTree',
  initialState,
  reducers: {
    loadRootTree(state, action) {
      return action.payload
    },
  },
})

export const { loadRootTree } = currentSlice.actions
export default currentSlice.reducer
