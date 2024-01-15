// Copy from https://github.com/uidotdev/usehooks/blob/main/index.js
import React from "react";

export default function useScroll(ref) {
  const [state, setState] = React.useState({
    x: null,
    y: null,
  });

  const scrollTo = React.useCallback((...args) => {
    if (!ref.current) {
      return
    }

    if (typeof args[0] === "object") {
      ref.current.scrollTo(args[0]);
    } else if (typeof args[0] === "number" && typeof args[1] === "number") {
      ref.current.scrollTo(args[0], args[1]);
    } else {
      throw new Error(
        `Invalid arguments passed to scrollTo. See here for more info. https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo`,
      );
    }
  }, []);

  React.useLayoutEffect(() => {
    const handleScroll = () => {
      if (!ref.current) {
        return
      }

      setState({
        x: ref.current.scrollLeft,
        y: ref.current.scrollTop,
      });
    };

    handleScroll();

    if (ref.current) {
      ref.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return [state, scrollTo];
}
