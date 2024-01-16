import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import classNames from "classnames";
import AvatarCanvas, { useAvatarAccessories } from "../AvatarCanvas/index.jsx";
import WearingDialog from "../WearingDialog/index.jsx";
import {
  undoApplyAccessoriesKeys,
  redoApplyAccessoriesKeys,
  setAccessoriesKeys,
} from "../../reducers/avatarModelReducer";

function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  const formattedDate = `${year}_${month}_${day}_${hours}_${minutes}_${period}`;
  return formattedDate;
}

async function exportAvatarToJPEG(avatarAccessories) {
  var canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;

  var context = canvas.getContext("2d");
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const loaders = _.chain(avatarAccessories)
    .orderBy("zIndex", "asc")
    .map((x) => {
      return new Promise((resolve, reject) => {
        const image = new Image();

        image.src = new URL(x.fileKey, import.meta.url);

        image.onload = () => {
          resolve(image);
        };

        image.onerror = (err) => {
          reject(err);
        };
      });
    })
    .value();

  const images = await Promise.all(loaders);

  for (let image of images) {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

  var dataURL = canvas.toDataURL("image/jpeg");

  var link = document.createElement("a");
  link.href = dataURL;
  link.download = `avatar_${getCurrentDate()}.jpg`;

  link.click();
}

function ExportAvatarButton() {
  const accessoryKeys = useAccessoryKeys();
  const avatarAccessories = useAvatarAccessories(accessoryKeys);

  return (
    <button
      className="btn-save"
      onClick={async () => exportAvatarToJPEG(avatarAccessories)}
    >
      导出
    </button>
  );
}

function PreviewBottomActions() {
  const currentAccessoriesKeys = useSelector(
    (state) => state.avatarModel.currentAccessoriesKeys,
  );
  const currentAccessoriesKeysLength = _.chain(currentAccessoriesKeys)
    .values()
    .value().length;
  const [showModal, setShowModal] = useState(false);
  const dialogShowAccessoriesKeys = useMemo(
    () => currentAccessoriesKeys,
    [showModal],
  );

  const handleWearingClicked = () => {
    if (!currentAccessoriesKeysLength) {
      return;
    }

    setShowModal(true);
  }

  return (
    <div className="preview-bottom-actions">
      <div className="actions-body">
        <button className="btn-styles" onClick={handleWearingClicked}>
          <span className="styles-count">{currentAccessoriesKeysLength}</span>
          <span>配件</span>
        </button>
        <ExportAvatarButton />
      </div>
      <WearingDialog
        open={showModal}
        onClose={() => setShowModal(false)}
        dialogShowAccessoriesKeys={dialogShowAccessoriesKeys}
      />
    </div>
  );
}

function PreviewRightActions() {
  const dispatch = useDispatch();
  const undoListLength = useSelector(
    (state) => state.avatarModel.undoList.length,
  );
  const redoListLength = useSelector(
    (state) => state.avatarModel.redoList.length,
  );

  const allAccessories = useSelector((state) => state.allAccessories);
  const allAccessoriesByTraitKey = useMemo(
    () => _.groupBy(allAccessories, "traitKey"),
    [allAccessories],
  );

  const handleRandomClicked = () => {
    const allTraitKeys = Object.keys(allAccessoriesByTraitKey);
    const sampleTraitKeys = _.sampleSize(
      allTraitKeys,
      _.random(Math.floor(allTraitKeys.length / 2), allTraitKeys.length),
    );

    const accessoryKeys = _.reduce(
      sampleTraitKeys,
      (acc, traitKey) => {
        acc[traitKey] = _.sample(allAccessoriesByTraitKey[traitKey]).key;
        return acc;
      },
      {},
    );

    dispatch(setAccessoriesKeys(accessoryKeys));
  };

  return (
    <div className="preview-right-actions">
      <button
        className={classNames({ btn: true, "btn-disabled": !redoListLength })}
        onClick={() => dispatch(redoApplyAccessoriesKeys())}
        aria-label="Redo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.3}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3"
          />
        </svg>
      </button>

      <button
        className={classNames({ btn: true, "btn-disabled": !undoListLength })}
        onClick={() => dispatch(undoApplyAccessoriesKeys())}
        aria-label="Undo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.3}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
          />
        </svg>
      </button>

      <button
        className="btn"
        onClick={() => handleRandomClicked()}
        aria-label="Random"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.3}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          />
        </svg>
      </button>
    </div>
  );
}

function useAccessoryKeys() {
  const styleFormAccessoriesKeys = useSelector(
    (state) => state.avatarModel.styleFormAccessoriesKeys,
  );
  const currentAccessoriesKeys = useSelector(
    (state) => state.avatarModel.currentAccessoriesKeys,
  );

  return _.uniq(
    _.flatten(
      _.values({
        ...currentAccessoriesKeys,
        ...styleFormAccessoriesKeys,
      }),
    ),
  );
}

export default () => {
  const accessoryKeys = useAccessoryKeys();

  return (
    <div className="preview-section-container">
      <div className="preview-section">
        <AvatarCanvas accessoryKeys={accessoryKeys} />
      </div>
      <PreviewBottomActions />
      <PreviewRightActions />
    </div>
  );
};
