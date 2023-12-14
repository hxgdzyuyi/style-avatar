import { useState, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import classNames from "classnames";
import AvatarCanvas from "../AvatarCanvas/index.jsx";

function PreviewBottomActions() {
  return (
    <div className="preview-bottom-actions">
      <div className="actions-body">
        <button className="btn-styles">
          <span className="styles-count">0</span>
          <span>配件</span>
        </button>
        <button className="btn-save">保存</button>
      </div>
    </div>
  );
}

function PreviewRightActions() {
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

export default () => {
  const styleFormAccessoriesKeys = useSelector((state) => state.avatarModel.styleFormAccessoriesKeys);
  const currentAccessoriesKeys = useSelector((state) => state.avatarModel.currentAccessoriesKeys);

  const accessoryKeys = _.uniq(_.flatten(_.values({
    ...currentAccessoriesKeys,
    ...styleFormAccessoriesKeys
  })))

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
