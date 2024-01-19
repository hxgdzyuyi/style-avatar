import { useState, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import classNames from "classnames";
import {
  closeStylePanel,
  loadStyleNodeForm,
  clearStyleNodeForm,
  applyRadioChange,
} from "../../reducers/panelModelReducer";

import {
  applyStyleFormAccessoriesKeys,
  clearStyleFormAccessoriesKeys,
  applyAccessoriesKeys,
} from "../../reducers/avatarModelReducer";

const StylePanelHeader = function () {
  const dispatch = useDispatch();
  const styleFormNode = useSelector((state) => state.panelModel.styleFormNode);
  const styleFormAccessoriesKeys = useSelector(
    (state) => state.avatarModel.styleFormAccessoriesKeys,
  );

  if (!styleFormNode) {
    return;
  }

  const handleCloseButtonClicked = () => {
    dispatch(closeStylePanel());
  };

  const handleApplyButtonClicked = () => {
    dispatch(applyAccessoriesKeys(styleFormAccessoriesKeys));
    dispatch(closeStylePanel());
  };

  return (
    <div className="style-panel-section-header">
      <div className="style-actions">
        <button onClick={handleCloseButtonClicked} className="btn">
          <i className="bi bi-arrow-left"></i>
        </button>

        <button onClick={handleApplyButtonClicked} className="btn">
          <i className="bi bi-check2"></i>
        </button>
      </div>
      <div className="node-label">{styleFormNode.nodeLabel}</div>
    </div>
  );
};

const StylePanelBody = function () {
  const styleFormNode = useSelector((state) => state.panelModel.styleFormNode);

  if (!styleFormNode) {
    return;
  }

  return (
    <div className="style-panel-section-body">
      <StyleForm ctxNode={styleFormNode} parentNodeLabels={[]} />
    </div>
  );
};

function fetchSortedNodes(ctxNode) {
  return _.chain(ctxNode.nodes)
    .values()
    .orderBy(["listOrder"], ["asc"])
    .value();
}

const CombineStyleForm = function ({ ctxNode, parentNodeLabels }) {
  const nodes = fetchSortedNodes(ctxNode);
  const currentNodeLabels = [...parentNodeLabels, ctxNode.nodeLabel];

  const renderCombineSection = (node) => {

    if (node.type == "accessory") {
      return <CombineAccessoryStyleForm key={node.nodeKey} ctxNode={node} parentNodeLabels={currentNodeLabels} />
    }

    return <StyleForm key={node.nodeKey} ctxNode={node} parentNodeLabels={currentNodeLabels} />
  }

  return (
    <div className="cmobile-container">{nodes.map(renderCombineSection)}</div>
  );
};


const CombineAccessoryStyleForm = function ({ ctxNode, parentNodeLabels }) {
  const currentNodeLabels = [...parentNodeLabels, ctxNode.nodeLabel];

  const renderRadio = (node) => (
    <div
      key={node.nodeKey}
      className={classNames({
        "col-3": true,
        "col-xl-2": true,
        "gy-2": true,
        "gx-2": true,
      })}
    >
      <div
        className={classNames({
          "preview-container": true,
          selected: true,
        })}
      >
        <img
          className="preview-image"
          src={new URL("/previews" + node.previewFileKey, import.meta.url)}
          alt=""
        />
      </div>
    </div>
  );

  return (<div className="radio-container">
      <div className="radio-title">
        <div className="radio-title-badge">
          {[...currentNodeLabels].join("/")}：
        </div>
      </div>
      <div className="row">
        {[ctxNode].map(renderRadio)}
      </div>
    </div>
 )
};

const RadioStyleForm = function ({ ctxNode, parentNodeLabels }) {
  const nodes = fetchSortedNodes(ctxNode);
  const currentNodeLabels = [...parentNodeLabels, ctxNode.nodeLabel];
  const selectedNode = _.find(nodes, (x) => x.nodeKey == ctxNode.selectNodeKey);
  const selectedNodeIsNode = selectedNode && selectedNode.type === "node";
  const dispatch = useDispatch();

  const handleRadioClicked = (ctxNode, node) => () => {
    dispatch(applyRadioChange({ path: ctxNode.path, nodeKey: node.nodeKey }));
  };

  const renderRadio = (node) => (
    <div
      key={node.nodeKey}
      onClick={handleRadioClicked(ctxNode, node)}
      className={classNames({
        "col-3": true,
        "col-xl-2": true,
        "gy-2": true,
        "gx-2": true,
      })}
    >
      <div
        className={classNames({
          "preview-container": true,
          selected: node.nodeKey == ctxNode.selectNodeKey,
        })}
      >
        <img
          className="preview-image"
          src={new URL("/previews" + node.previewFileKey, import.meta.url)}
          alt=""
        />
      </div>
    </div>
  );

  const renderSelectedNodeForm = () => {
    if (!selectedNodeIsNode) {
      return null;
    }

    return (
      <StyleForm
        ctxNode={selectedNode}
        parentNodeLabels={[currentNodeLabels]}
      />
    );
  };

  return (
    <div className="radio-container">
      <div className="radio-title">
        <div className="radio-title-badge">
          {[...currentNodeLabels].join("/")}：
        </div>
      </div>
      <div className="row">
        {nodes.map(renderRadio)}
      </div>

      {renderSelectedNodeForm()}
    </div>
  );
};

const AccessoryStyleForm = function ({ ctxNode, parentNodeLabels }) {
  return (
    <div>
      <div className="preview-container">
        <img
          className="preview-image"
          src={new URL("/previews" + ctxNode.previewFileKey, import.meta.url)}
          alt=""
        />
      </div>
    </div>
  );
};

const StyleForm = function (props) {
  const { ctxNode } = props;

  if (ctxNode.selectType === "combine") {
    return <CombineStyleForm {...props} />;
  }

  if (ctxNode.selectType === "radio") {
    return <RadioStyleForm {...props} />;
  }

  if (ctxNode.type === "accessory") {
    return <AccessoryStyleForm {...props} />;
  }
};

function findStyleNode(rootTree, destStyleNodeKey) {
  let findedStyleNode;
  let findedTraitNode;

  for (let traitNodeKey in rootTree.nodes) {
    const traitNode = rootTree.nodes[traitNodeKey];
    if (!traitNode) {
      continue;
    }

    for (var styleNodeKey in traitNode.nodes) {
      const styleNode = traitNode.nodes[styleNodeKey];
      if (!styleNode) {
        continue;
      }

      if (styleNodeKey == destStyleNodeKey) {
        findedStyleNode = styleNode;
        findedTraitNode = traitNode;
        break;
      }
    }

    if (findedStyleNode) {
      break;
    }
  }

  return [findedStyleNode, findedTraitNode];
}

function buildAccessoriesKeys(findedStyleNode) {
  let findedKeys = [];

  if (findedStyleNode.type === "accessory") {
    findedKeys.push(findedStyleNode.key);
    return findedKeys;
  }

  if (findedStyleNode.selectType === "combine") {
    _.each(Object.values(findedStyleNode.nodes), (node) => {
      findedKeys = findedKeys.concat(buildAccessoriesKeys(node));
    });

    return findedKeys;
  }

  if (findedStyleNode.selectType === "radio") {
    const selectedNode = _.find(Object.values(findedStyleNode.nodes), [
      "nodeKey",
      findedStyleNode.selectNodeKey,
    ]);

    findedKeys = findedKeys.concat(buildAccessoriesKeys(selectedNode));
    return findedKeys;
  }

  return findedKeys;
}

export default () => {
  const openedStylePanelKey = useSelector(
    (state) => state.panelModel.openedStylePanelKey,
  );

  const rootTree = useSelector((state) => state.rootTree);
  const allAccessories = useSelector((state) => state.allAccessories);

  const currentTraitNodeKey = useSelector(
    (state) => state.panelModel.currentTraitNodeKey,
  );
  const currentAccessoriesKeys = useSelector(
    (state) => state.avatarModel.currentAccessoriesKeys,
  );
  const defaultAccessoriesKeysDict = _.keyBy(currentAccessoriesKeys[currentTraitNodeKey] || [])

  const dispatch = useDispatch();
  const styleFormNode = useSelector((state) => state.panelModel.styleFormNode);
  const styleFormTraitKey = useSelector(
    (state) => state.panelModel.styleFormTraitKey,
  );

  useLayoutEffect(() => {
    const [findedStyleNode, findedTraitNode] = findStyleNode(
      rootTree,
      openedStylePanelKey,
    );

    dispatch(
      loadStyleNodeForm({
        traitNodeKey: findedTraitNode.nodeKey,
        styleNode: findedStyleNode,
        defaultAccessoriesKeysDict,
      }),
    );

    return () => {
      dispatch(clearStyleNodeForm());
      dispatch(clearStyleFormAccessoriesKeys());
    };
  }, [dispatch, rootTree, openedStylePanelKey]);

  useEffect(() => {
    if (styleFormNode) {
      dispatch(
        applyStyleFormAccessoriesKeys({
          traitNodeKey: styleFormTraitKey,
          accessoriesKeys: buildAccessoriesKeys(styleFormNode),
        }),
      );
    }

    return () => {};
  }, [dispatch, styleFormNode, styleFormTraitKey]);

  if (!styleFormNode) {
    return null;
  }

  return (
    <>
      <StylePanelHeader />
      <StylePanelBody />
    </>
  );
};
