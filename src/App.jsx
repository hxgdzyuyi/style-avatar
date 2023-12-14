import { useState, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import reactLogo from "./assets/react.svg";
import { loadRootTree } from "./reducers/rootTreeReducer";
import { loadAllAccessories } from "./reducers/allAccessoriesReducer";
import { accessories as allAccessories, root as rootTree } from "./avatar.json";
import AvatarCanvas from "./components/AvatarCanvas";
import PanelSection from "./components/PanelSection";

function App() {
  const dispatch = useDispatch();
  const currentRootTree = useSelector((state) => state.rootTree);

  useLayoutEffect(() => {
    dispatch(loadAllAccessories(allAccessories));
    dispatch(loadRootTree(rootTree));
  }, [dispatch]);

  if (!currentRootTree) {
    return null;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <PanelSection />
        </div>
        <div className="col-6">
          Hello2
          <div style={{ position: "relative", width: 200, height: 200 }}>
            <AvatarCanvas accessoryKeys={["eyes_eyes4_part2_pink"]} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
