import React from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import Backdrop from "../Backdrop";
import useEventListener from "../../hooks/useEventListener";

const styles = {
  /* Styles applied to the root element. */
  root: {
    position: "fixed",
    zIndex: 1000,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
  },
};

/**
 * Modal is a lower-level construct that is leveraged by the following components:
 *
 */
const Modal = React.forwardRef(function Modal(props, ref) {
  const { children, onClose, open, BackdropProps, showBackdrop = true } = props;

  const style = showBackdrop
    ? styles.root
    : { ...styles.root, pointerEvents: "none" };

  const handleBackdropClick = (event) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (onClose) {
      onClose(event, "backdropClick");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Escape") {
      return;
    }

    event.stopPropagation();

    if (onClose) {
      onClose(event, "escapeKeyDown");
    }
  };

  useEventListener("keydown", handleKeyDown, { enable: open });

  if (!open) {
    return null;
  }

  const stopPropagation = function (e) {
    e.stopPropagation();
  };

  return createPortal(
    <div
      onClick={stopPropagation}
      onContextMenu={stopPropagation}
      role="presentation"
      style={{ ...style, ...(open ? {} : { visibility: "hidden" }) }}
    >
      <Backdrop
        open={showBackdrop}
        onClick={handleBackdropClick}
        {...BackdropProps}
      />
      {React.cloneElement(children)}
    </div>,
    document.body,
  );
});

Modal.propTypes = {
  /**
   * Callback fired when the component requests to be closed.
   * The `reason` parameter can optionally be used to control the response to `onClose`.
   *
   * @param {object} event The event source of the callback.
   * @param {string} reason Can be: `"escapeKeyDown"`, `"backdropClick"`.
   */
  onClose: PropTypes.func,

  /**
   * A single child content element.
   */
  children: PropTypes.node,

  /**
   * If `true`, the modal is open.
   */
  open: PropTypes.bool.isRequired,

  /**
   * Props applied to the [`Backdrop`]) element.
   */
  BackdropProps: PropTypes.object,
};

export default Modal;
