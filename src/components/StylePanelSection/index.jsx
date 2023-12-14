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

//const TabItem = function ({ active, currentItem }) {
//return (
//<div
//className={classNames({
//active: active,
//"nav-element": true,
//})}
//>
//{currentItem.nodeLabel}
//</div>
//);
//};

//TODO: <img src={new URL("/previews" + currentItem.previewFileKey, import.meta.url)} alt=""/>

const StylePanelHeader = function () {
  const dispatch = useDispatch();
  const styleFormNode = useSelector((state) => state.panelModel.styleFormNode);
  const styleFormAccessoriesKeys = useSelector((state) => state.avatarModel.styleFormAccessoriesKeys);

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
      <button onClick={handleCloseButtonClicked}>取消</button>
      <button onClick={handleApplyButtonClicked}>应用</button>
      {styleFormNode.nodeLabel}
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

  const renderCombineSection = (node) => (
    <div key={node.nodeKey}>
      <div className="title">
        section: {[...currentNodeLabels, node.nodeLabel].join(">")}
      </div>
      <div>
        <StyleForm ctxNode={node} parentNodeLabels={currentNodeLabels} />
      </div>
    </div>
  );

  return (
    <div>
      <div className="cmobile-container">{nodes.map(renderCombineSection)}</div>
    </div>
  );
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
        selected: node.nodeKey == ctxNode.selectNodeKey,
      })}
    >
      <div>
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
        parentNodeLabels={[currentNodeLabels, selectedNode.nodeLabel]}
      />
    );
  };

  return (
    <div className="radio-container">
      {nodes.map(renderRadio)}
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
    const selectedNode = _.find(
      Object.values(findedStyleNode.nodes), ["nodeKey", findedStyleNode.selectNodeKey],
    );

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
  const dispatch = useDispatch();
  const styleFormNode = useSelector((state) => state.panelModel.styleFormNode);
  const styleFormTraitKey = useSelector((state) => state.panelModel.styleFormTraitKey);

  useLayoutEffect(() => {
    const [findedStyleNode, findedTraitNode] = findStyleNode(rootTree, openedStylePanelKey);

    dispatch(loadStyleNodeForm({
      traitNodeKey: findedTraitNode.nodeKey,
      styleNode: findedStyleNode,
    }));

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
            accessoriesKeys: buildAccessoriesKeys(styleFormNode)
        })
      );
    }

    return () => {};
  }, [dispatch, styleFormNode, styleFormTraitKey]);

  if (!styleFormNode) {
    return null
  }

  return (
    <>
      <StylePanelHeader />
      <StylePanelBody />
    </>
  );
};
