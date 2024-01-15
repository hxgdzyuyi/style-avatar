import { createSlice, current } from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = {
  currentTraitNodeKey: "background",
  openedStylePanelKey: "",
  styleFormNode: null,
  styleFormTraitKey: null,
  panelHeaderScrollX: null,
};


function findPathFromAccessory({
  ctxNode,
  pathCtx,
  currentPath,
}, accessoryKey) {
  if (ctxNode.type === "accessory") {
    if (ctxNode.key === accessoryKey) {
      pathCtx.path = currentPath
    }
    return;
  }

  if (ctxNode.selectType === "combine" || ctxNode.selectType === "radio") {
    _.each(Object.entries(ctxNode.nodes), ([key, node]) => {
      findPathFromAccessory({
        ctxNode: node,
        currentPath: [...currentPath, key],
        pathCtx,
      }, accessoryKey);
    });
  }
}

function convertToStyleFormNode({
  ctxNode,
  currentPath,
  canSelect,
  selectNodeKey,
}) {
  if (ctxNode.type === "accessory") {
    return;
  }

  if (ctxNode.selectType === "combine") {
    ctxNode.path = currentPath;
    _.each(Object.entries(ctxNode.nodes), ([key, node]) => {
      convertToStyleFormNode({
        ctxNode: node,
        currentPath: [...currentPath, key],
        canSelect,
        selectNodeKey: null,
      });
    });
  }

  if (ctxNode.selectType === "radio") {
    ctxNode.path = currentPath;

    const defaultKeyNode = _.head(
      _.orderBy(Object.values(ctxNode.nodes), ["listOrder"], ["asc"]),
    );

    ctxNode.defaultSelectNodeKey = defaultKeyNode.nodeKey;

    if (canSelect) {
      if (selectNodeKey) {
        ctxNode.selectNodeKey = selectNodeKey
      } else {
        ctxNode.selectNodeKey = ctxNode.defaultSelectNodeKey
      }
    } else {
      ctxNode.selectNodeKey = ""
    }

    _.each(Object.entries(ctxNode.nodes), ([key, node]) => {
      convertToStyleFormNode({
        ctxNode: node,
        currentPath: [...currentPath, key],
        canSelect: canSelect && key === ctxNode.selectNodeKey,
        selectNodeKey: null,
      });
    });
  }
}


function applyAccessoryKeyTree({
  ctxNode,
  accessoryKeyTree,
  canSelect,
}) {
  if (ctxNode.type === "accessory") {
    return;
  }

  if (ctxNode.selectType === "combine") {
    _.each(Object.entries(ctxNode.nodes), ([nodeKey, node]) => {
      applyAccessoryKeyTree({
        ctxNode: node,
        canSelect,
        accessoryKeyTree: accessoryKeyTree[nodeKey] || {},
      });
    });
  }

  if (ctxNode.selectType === "radio") {
    if (canSelect) {
      if (!_.isEmpty(accessoryKeyTree)) {
        ctxNode.selectNodeKey = _.first(Object.keys(accessoryKeyTree))
      } else {
        ctxNode.selectNodeKey = ctxNode.defaultSelectNodeKey
      }
    } else {
      ctxNode.selectNodeKey = ""
    }

    _.each(Object.entries(ctxNode.nodes), ([nodeKey, node]) => {
      applyAccessoryKeyTree({
        ctxNode: node,
        accessoryKeyTree: accessoryKeyTree[nodeKey] || {},
        canSelect: canSelect && nodeKey === ctxNode.selectNodeKey,
      });
    });
  }
}

const currentSlice = createSlice({
  name: "panelModel",
  initialState,
  reducers: {
    loadStyleNodeForm(state, action) {
      let { styleNode, traitNodeKey, defaultAccessoriesKeysDict } =
        action.payload;

      let ctxNode = _.cloneDeep(styleNode);
      convertToStyleFormNode({
        ctxNode,
        currentPath: [],
        canSelect: true,
        selectNodeKey: null,
      });

      let accessoryKeyTree = _.chain(defaultAccessoriesKeysDict)
        .keys()
        .map((accessoryKey) => {
          let pathCtx = { path: [] };
          findPathFromAccessory({
            ctxNode,
            currentPath: [],
            pathCtx,
          }, accessoryKey)

          return pathCtx.path
        })
        .reduce((treeCtx, path) => {
          path.reduce((acc, pathKey) => {
            if (!acc[pathKey]) {
              acc[pathKey] = {}
            }
            return acc[pathKey]
          }, treeCtx)

          return treeCtx
        }, {})
        .value()

      applyAccessoryKeyTree({
        ctxNode,
        accessoryKeyTree,
        canSelect: true,
      })

      state.styleFormNode = ctxNode;
      state.styleFormTraitKey = traitNodeKey;

      return state;
    },

    applyRadioChange(state, action) {
      const { path, nodeKey } = action.payload;

      const findedNode = path.length
        ? _.get(state.styleFormNode, path.map((x) => `nodes.${x}`).join("."))
        : state.styleFormNode;

      convertToStyleFormNode({
        ctxNode: findedNode,
        currentPath: path,
        canSelect: true,
        selectNodeKey: nodeKey,
      });

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

    setPanelHeaderScrollX(state, action) {
      state.panelHeaderScrollX = action.payload;
      return state;
    }
  },
});

export const {
  switchTraitNodeKey,
  openStylePanel,
  closeStylePanel,
  loadStyleNodeForm,
  clearStyleNodeForm,
  applyRadioChange,
  setPanelHeaderScrollX,
} = currentSlice.actions;
export default currentSlice.reducer;
