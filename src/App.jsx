import { useState, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import reactLogo from "./assets/react.svg";
import { loadRootTree } from "./reducers/rootTreeReducer";
import { openStylePanel } from "./reducers/panelModelReducer";
import { loadAllAccessories } from "./reducers/allAccessoriesReducer";
import { accessories as allAccessories, root as rootTree } from "./avatar.json";
import AvatarCanvas from "./components/AvatarCanvas";
import PanelSection from "./components/PanelSection";
import PreviewSection from "./components/PreviewSection";

function App() {
  const dispatch = useDispatch();
  const currentRootTree = useSelector((state) => state.rootTree);

  useLayoutEffect(() => {
    dispatch(loadAllAccessories(allAccessories));
    dispatch(loadRootTree(rootTree));
    //TODO: dispatch(openStylePanel("clothing8"));
  }, [dispatch]);

  if (!currentRootTree) {
    return null;
  }

  return (
    <div className="main-container">
      <div className="panel-section-column">
        <PanelSection />
      </div>
      <div className="preview-section-column">
        <PreviewSection />
      </div>
    </div>
  );
}

export default App;
