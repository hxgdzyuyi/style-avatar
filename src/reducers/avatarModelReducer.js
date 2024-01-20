import { createSlice, current, original } from "@reduxjs/toolkit";
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
      const { traitNodeKey, accessoriesKeys } = action.payload;

      state.styleFormAccessoriesKeys = {
        [traitNodeKey]: accessoriesKeys,
      };

      return state;
    },

    clearStyleFormAccessoriesKeys: (state, action) => {
      state.styleFormAccessoriesKeys = {};
      return state;
    },

    removeAccessoriesKeysByTraitNodeKey: (state, action) => {
      const { traitNodeKey } = action.payload;

      state.undoList.push(current(state.currentAccessoriesKeys));
      delete state.currentAccessoriesKeys[traitNodeKey];
      return state;
    },

    setAccessoriesKeys: (state, action) => {
      const { payload } = action;
      state.redoList = [];
      state.undoList.push(state.currentAccessoriesKeys);
      state.currentAccessoriesKeys = {
        ...payload,
      };
      return state;
    },

    applyAccessoriesKeys: (state, action) => {
      const { payload } = action;

      const payloadKeys = _.keys(payload);
      const currentWillApplyed = _.pick(state.currentAccessoriesKeys, payloadKeys);

      if (_.isEqual(payload, currentWillApplyed)) {
        return state;
      }

      state.redoList = [];
      state.undoList.push(current(state.currentAccessoriesKeys));
      state.currentAccessoriesKeys = {
        ...state.currentAccessoriesKeys,
        ...payload,
      };
      return state;
    },

    undoApplyAccessoriesKeys: (state, action) => {
      if (state.undoList.length) {
        state.redoList.push(current(state.currentAccessoriesKeys));
        state.currentAccessoriesKeys = state.undoList.pop();
      }
      return state;
    },

    redoApplyAccessoriesKeys: (state, action) => {
      if (state.redoList.length) {
        state.undoList.push(current(state.currentAccessoriesKeys));
        state.currentAccessoriesKeys = state.redoList.pop();
      }
      return state;
    },
  },
});

export const {
  applyStyleFormAccessoriesKeys,
  clearStyleFormAccessoriesKeys,
  applyAccessoriesKeys,
  removeAccessoriesKeysByTraitNodeKey,
  undoApplyAccessoriesKeys,
  redoApplyAccessoriesKeys,
  setAccessoriesKeys,
} = currentSlice.actions;
export default currentSlice.reducer;
