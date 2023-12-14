import { createSlice, current } from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = {
  styleFormAccessoriesKeys: {},
  currentAccessoriesKeys: {},
  undoList: [],
  redoList: [],
};

const currentSlice = createSlice({
  name: "avatarModel",
  initialState,
  reducers: {
    applyStyleFormAccessoriesKeys: (state, action) => {
      const { traitNodeKey, accessoriesKeys } = action.payload

      state.styleFormAccessoriesKeys = {
        [traitNodeKey]: accessoriesKeys
      };

      return state
    },

    clearStyleFormAccessoriesKeys: (state, action) => {
      state.styleFormAccessoriesKeys = {};
      return state
    },

    applyAccessoriesKeys: (state, action) => {
      const { payload } = action
      state.currentAccessoriesKeys = {
        ...state.currentAccessoriesKeys,
        ...payload,
      };
      state.undoList.push(state.currentAccessoriesKeys);
      return state
    }
  },
});

export const {
  applyStyleFormAccessoriesKeys,
  clearStyleFormAccessoriesKeys,
  applyAccessoriesKeys,
} = currentSlice.actions;
export default currentSlice.reducer;