import { useEffect } from "react";
import { KeyCodes } from "../../game/utils/inputHandler";
/**
 * useKeyPress
 * @param {string} key - the name of the key to respond to, compared against event.key
 * @param {function} action - the action to perform on key press
 */
const useKeypress = (key: KeyCodes, action: (e: KeyboardEvent) => void) => {
  useEffect(() => {
    const onKeyup = (e: KeyboardEvent) => {
      if (e.keyCode === key) {
        action(e);
      }
    };
    window.addEventListener("keyup", onKeyup);
    return () => window.removeEventListener("keyup", onKeyup);
    // eslint-disable-next-line
  }, []);
};

export default useKeypress;
