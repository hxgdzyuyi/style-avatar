import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentTraitNodeKey: "background"
}

const currentSlice = createSlice({
  name: 'panelModel',
  initialState,
  reducers: {
    switchTraitNodeKey(state, action) {
      state.currentTraitNodeKey = action.payload
      return state
    },
  },
})

export const { switchTraitNodeKey } = currentSlice.actions
export default currentSlice.reducer
