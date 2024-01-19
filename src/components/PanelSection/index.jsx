import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import classNames from "classnames";
import {
  switchTraitNodeKey,
  setPanelHeaderScrollX,
  openStylePanel,
} from "../../reducers/panelModelReducer";
import StylePanelSection from "../StylePanelSection";
import useScroll from "../../hooks/useScroll";

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

const PanelHeader = function () {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const [{ x, _y }, scrollTo] = useScroll(scrollRef);
  const panelHeaderScrollX = useSelector(state => state.panelModel.panelHeaderScrollX);

  useEffect(() => {
    if (panelHeaderScrollX) {
      scrollTo(panelHeaderScrollX, 0)
    }
  }, [scrollTo])

  useEffect(() => {
    dispatch(setPanelHeaderScrollX(x))
  }, [x])

  const rootTree = useSelector((state) => state.rootTree);
  const traitNodes = _.orderBy(
    Object.values(rootTree.nodes),
    ["listOrder"],
    ["asc"],
  );

  const currentTraitNodeKey = useSelector(
    (state) => state.panelModel.currentTraitNodeKey,
  );

  const handleNavItemClicked =
    ({ nodeKey }) =>
    () => {
      dispatch(switchTraitNodeKey(nodeKey));
    };

  return (
    <div className="panel-section-header" ref={scrollRef}>
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
  const allAccessories = useSelector((state) => state.allAccessories);

  const currentAccessoriesKeys = useSelector(
    (state) => state.avatarModel.currentAccessoriesKeys,
  );

  const currnetStyleKeysDict = _.keyBy(
    allAccessories.filter((x) =>
      (currentAccessoriesKeys[currentTraitNodeKey] || []).includes(x.key),
    ),
    "styleKey",
  );

  const styleNodes = _.orderBy(
    Object.values((rootTree.nodes[currentTraitNodeKey] || {}).nodes),
    ["listOrder"],
    ["asc"],
  );

  const dispatch = useDispatch();

  const handleGridItemClicked =
    ({ nodeKey }, selected ) =>
    () => {
      dispatch(openStylePanel({
        openedStylePanelKey: nodeKey,
        openedStylePanelCanCancelStyle: selected,
      }));
    };

  return (
    <div className="panel-section-body">
      <div className="row">
        {styleNodes.map((x) => {
          return (
            <div
              className="panel-item col-3 gy-2 col-sm-6 gy-sm-3 col-md-4 gy-md-4 col-xl-3 gy-xl-4"
              key={x.nodeKey}
              onClick={handleGridItemClicked(x, !!currnetStyleKeysDict[x.nodeKey])}
            >
              <div
                className={classNames({
                  "preview-container": true,
                  selected: !!currnetStyleKeysDict[x.nodeKey],
                })}
              >
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
