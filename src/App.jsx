import { useState, useLayoutEffect, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import reactLogo from "./assets/react.svg";
import { loadRootTree } from "./reducers/rootTreeReducer";
import { openStylePanel } from "./reducers/panelModelReducer";
import { loadAllAccessories } from "./reducers/allAccessoriesReducer";
import { accessories as allAccessories, root as rootTree } from "./avatar.json";
import AvatarCanvas from "./components/AvatarCanvas";
import PanelSection from "./components/PanelSection";
import PreviewSection from "./components/PreviewSection";
import useMediaQuery from "./hooks/useMediaQuery";
import classNames from "classnames";

function App() {
  const dispatch = useDispatch();
  const currentRootTree = useSelector((state) => state.rootTree);

  useLayoutEffect(() => {
    dispatch(loadAllAccessories(allAccessories));
    dispatch(loadRootTree(rootTree));
    //TODO: dispatch(openStylePanel("clothing8"));
  }, [dispatch]);

  const isPortaitPhone = useMediaQuery("(max-width: 575.98px)");

  useEffect(() => {
    if (isPortaitPhone) {
      document.body.classList.add('is-portait-phone');
    }

    return () => {
      document.body.classList.remove('is-portait-phone');
    }
  }, [isPortaitPhone])

  if (!currentRootTree) {
    return null;
  }

  const PanelSectionColumn = () => (
    <div className="panel-section-column">
      <PanelSection />
    </div>
  );
  const PreviewSectionColumn = () => (
    <div className="preview-section-column">
      <PreviewSection />
    </div>
  );

  const PortraitPhoneLayout = () => {
    return (
      <>
        <PreviewSectionColumn />
        <PanelSectionColumn />
      </>
    );
  };

  const NormalLayout = () => {
    return (
      <>
        <PanelSectionColumn />
        <PreviewSectionColumn />
      </>
    );
  };

  return (
    <div
      className={classNames({
        "main-container": true,
        "portait-phone-layout": isPortaitPhone,
        "normal-layout": !isPortaitPhone,
      })}
    >
      {isPortaitPhone ? <PortraitPhoneLayout /> : <NormalLayout />}
    </div>
  );
}

export default App;
