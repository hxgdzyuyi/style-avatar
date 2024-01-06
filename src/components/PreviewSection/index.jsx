import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import classNames from "classnames";
import AvatarCanvas, { useAvatarAccessories } from "../AvatarCanvas/index.jsx";
import WearingDialog from "../WearingDialog/index.jsx";

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

  return (
    <div className="preview-bottom-actions">
      <div className="actions-body">
        <button className="btn-styles" onClick={() => setShowModal(true)}>
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

  return (
    <div className="preview-right-actions">
      <button className="btn" aria-label="分享">
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
            d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
          />
        </svg>
      </button>

      <button className="btn" aria-label="Redo">
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

      <button className="btn" aria-label="Undo">
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

      <button className="btn" aria-label="随机">
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
      <PreviewRightActions />
      <PreviewBottomActions />
    </div>
  );
};
