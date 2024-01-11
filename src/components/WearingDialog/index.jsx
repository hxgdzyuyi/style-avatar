import Modal from "../Modal";
import React from "react";
import clsx from "classnames";
import AvatarCanvas from "../AvatarCanvas/index.jsx";
import { useSelector, useDispatch } from "react-redux";
import {
  applyAccessoriesKeys,
  removeAccessoriesKeysByTraitNodeKey,
} from "../../reducers/avatarModelReducer";

const styles = {
  wrapper: {
    position: "fixed",
    zIndex: 1000,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    alignContent: "space-around",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    pointerEvents: "none",
  },
};

const WearingDialogContent = (props) => {
  const { dialogShowAccessoriesKeys } = props;
  const currentAccessoriesKeys = useSelector(
    (state) => state.avatarModel.currentAccessoriesKeys,
  );

  const dispatch = useDispatch();
  const handleItemClicked = (traitNodeKey, accessoriesKeys, selected) => () => {
    if (selected) {
      dispatch(
        removeAccessoriesKeysByTraitNodeKey({
          traitNodeKey,
        }),
      );
    } else {
      dispatch(
        applyAccessoriesKeys({
          [traitNodeKey]: accessoriesKeys,
        }),
      );
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        pointerEvents: "all",
        borderRadius: 8,
      }}
    >
      <div className="dialog-header">
        <h3>配件</h3>
      </div>
      <div className="dialog-body">
        <div className="container">
          <div className="row">
            {Object.entries(dialogShowAccessoriesKeys)
              .filter(([_key, accessoryKeys]) => accessoryKeys.length != 0)
              .map(([key, accessoryKeys]) => {
                const selected = !!currentAccessoriesKeys[key];
                return (
                  <div
                    key={key}
                    onClick={handleItemClicked(key, accessoryKeys, selected)}
                    className={clsx({
                      "col-4": true,
                      "gy-2": true,
                      selected: selected,
                    })}
                  >
                    <AvatarCanvas accessoryKeys={accessoryKeys} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.forwardRef(function WearingDialog(props, ref) {
  const { disableCloseIcon, onClose, open, className, ...others } = props;

  return (
    <Modal open={open} onClose={onClose} {...others}>
      <div style={styles.wrapper}>
        <div className="dialog-wrap wearing-dialog">
          {!disableCloseIcon && (
            <button
              className="btn dialog-icon-close"
              aria-label="关闭"
              onClick={onClose}
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
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <WearingDialogContent {...props} />
        </div>
      </div>
    </Modal>
  );
});
