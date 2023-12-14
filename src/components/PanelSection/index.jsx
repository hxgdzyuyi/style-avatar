import { useState, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import classNames from "classnames";
import {
  switchTraitNodeKey,
  openStylePanel,
} from "../../reducers/panelModelReducer";
import StylePanelSection from "../StylePanelSection";

const TabItem = function ({ active, currentItem }) {
  return (
    <div
      className={classNames({
        active: active,
        "nav-element": true,
      })}
    >
      {currentItem.nodeLabel}
    </div>
  );
};


//TODO: <img src={new URL("/previews" + currentItem.previewFileKey, import.meta.url)} alt=""/>

const PanelHeader = function () {
  const rootTree = useSelector((state) => state.rootTree);
  const traitNodes = _.orderBy(
    Object.values(rootTree.nodes),
    ["listOrder"],
    ["asc"],
  );
  const dispatch = useDispatch();

  const currentTraitNodeKey = useSelector(
    (state) => state.panelModel.currentTraitNodeKey,
  );

  const handleNavItemClicked =
    ({ nodeKey }) =>
    () => {
      dispatch(switchTraitNodeKey(nodeKey));
    };

  return (
    <div className="panel-section-header">
      <ul className="nav">
        {traitNodes.map((x) => (
          <li
            className="nav-item"
            key={x.nodeKey}
            onClick={handleNavItemClicked(x)}
          >
            <TabItem
              active={currentTraitNodeKey === x.nodeKey}
              currentItem={x}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const PanelBody = function () {
  const currentTraitNodeKey = useSelector(
    (state) => state.panelModel.currentTraitNodeKey,
  );

  const rootTree = useSelector((state) => state.rootTree);
  const styleNodes = _.orderBy(
    Object.values((rootTree.nodes[currentTraitNodeKey] || {}).nodes),
    ["listOrder"],
    ["asc"],
  );

  const dispatch = useDispatch();

  const handleGridItemClicked =
    ({ nodeKey }) =>
    () => {
      dispatch(openStylePanel(nodeKey));
    };

  return (
    <div className="panel-section-body">
      <div className="row">
        {styleNodes.map((x) => {
          return (
            <div
              className="col-6 col-xl-3 gy-4"
              key={x.nodeKey}
              onClick={handleGridItemClicked(x)}
            >
              <div className="preview-container">
                <img
                  className="preview-image"
                  src={new URL("/previews" + x.previewFileKey, import.meta.url)}
                  alt=""
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default () => {
  const openedStylePanelKey = useSelector(
    (state) => state.panelModel.openedStylePanelKey,
  );

  if (!openedStylePanelKey) {
    return (
      <div className="panel-section-container">
        <PanelHeader />
        <PanelBody />
      </div>
    );
  }

  return (
    <div className="panel-section-container">
      <StylePanelSection />
    </div>
  );
};
