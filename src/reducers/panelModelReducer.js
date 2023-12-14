import { createSlice, current } from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = {
  currentTraitNodeKey: "background",
  openedStylePanelKey: "",
  styleFormNode: null,
  styleFormTraitKey: null,
};

function convertToStyleFormNode({ ctxNode, currentPath, isSelect }) {
  if (ctxNode.type === "accessory") {
    return;
  }

  if (ctxNode.selectType === "combine") {
    ctxNode.path = currentPath;
    _.each(Object.entries(ctxNode.nodes), ([key, node]) => {
      convertToStyleFormNode({
        ctxNode: node,
        currentPath: [...currentPath, key],
        isSelect,
      });
    });
  }

  if (ctxNode.selectType === "radio") {
    ctxNode.path = currentPath;

    const defaultKeyNode = _.head(
      _.orderBy(Object.values(ctxNode.nodes), ["listOrder"], ["asc"]),
    );

    ctxNode.defaultSelectNodeKey = defaultKeyNode.nodeKey;
    if (! ctxNode.selectNodeKey) {
      ctxNode.selectNodeKey = isSelect ? ctxNode.defaultSelectNodeKey : "";
    }

    _.each(Object.entries(ctxNode.nodes), ([key, node]) => {
      convertToStyleFormNode({
        ctxNode: node,
        currentPath: [...currentPath, key],
        isSelect: isSelect && key === ctxNode.selectNodeKey,
      });
    });
  }
}

const currentSlice = createSlice({
  name: "panelModel",
  initialState,
  reducers: {
    loadStyleNodeForm(state, action) {
      let {styleNode, traitNodeKey} = action.payload

      let ctxNode = _.cloneDeep(styleNode);
      convertToStyleFormNode({ ctxNode, currentPath: [], isSelect: true });
      state.styleFormNode = ctxNode;
      state.styleFormTraitKey = traitNodeKey;

      return state;
    },

    applyRadioChange(state, action) {
      const { path, nodeKey } = action.payload

      const findedNode = path.length ? _.get(state.styleFormNode, path.map(x => `nodes.${x}`).join('.')) : state.styleFormNode

      findedNode.selectNodeKey = nodeKey

      convertToStyleFormNode({
        ctxNode: findedNode,
        currentPath: path,
        isSelect: true
      })

      return state;
    },

    clearStyleNodeForm(state, action) {
      state.styleFormNode = null;
      state.styleFormTraitKey = null;
      return state;
    },

    openStylePanel(state, action) {
      state.openedStylePanelKey = action.payload;
      return state;
    },

    closeStylePanel(state, action) {
      state.openedStylePanelKey = "";
      return state;
    },

    switchTraitNodeKey(state, action) {
      state.currentTraitNodeKey = action.payload;
      return state;
    },
  },
});

export const {
  switchTraitNodeKey,
  openStylePanel,
  closeStylePanel,
  loadStyleNodeForm,
  clearStyleNodeForm,
  applyRadioChange,
} = currentSlice.actions;
export default currentSlice.reducer;
