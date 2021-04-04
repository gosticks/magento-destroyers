let useOrientation: boolean | undefined = undefined;

export const requestOrientation = () => {
  if (typeof DeviceOrientationEvent === undefined) {
    useOrientation = false;
    return;
  }


  if (typeof (DeviceOrientationEvent as any).requestPermission !== "function") {
    useOrientation = false;
    return
  }

  (DeviceOrientationEvent as any)
    .requestPermission()
    .then((response: string) => {
      if (response === "granted" && window.DeviceOrientationEvent) {
        useOrientation = true;
        return
      }
      useOrientation = false;

    }).catch((err: any) => {
      useOrientation = false;
    });

  useOrientation = true;
  return;
};

export const waitForOrientationRequest = () => {
  const awaitResolve = () => {
    if (useOrientation !== undefined) {
      return true;
    }
    // console.log("waiting:", useOrientation);
    setTimeout(awaitResolve, 200);
  };

  return new Promise((resolve, reject) => {
    if (awaitResolve()) {
      resolve(true);
    } else {
      reject()
    }
  });
};

const createInputHandler = (
  orientationHandler?: (e: DeviceOrientationEvent) => void
) => {
  const instance = {
    onDeviceOrientationChange: orientationHandler,
    pressedKeys: new Map<number, boolean>(),
    onKeyUp: (e: KeyboardEvent) => {
      instance.pressedKeys.delete(e.keyCode);

      // handle single key press handlers
      const handler = instance.keySingleHandlers.get(e.keyCode);
      if (handler) {
        handler();
      }
    },
    onKeyDown: (e: KeyboardEvent) => {
      instance.pressedKeys.set(e.keyCode, true);
    },
    run: () => {
      instance.pressedKeys.forEach((val, key) => {
        if (!val) {
          return;
        }
        const k = key as KeyCodes;
        const handler = instance.keyHandlers.get(k);
        if (!handler) {
          return;
        }
        handler();
      });
    },
    destroy: () => {
      document.onkeydown = null;
      document.onkeyup = null;
      if (instance.onDeviceOrientationChange) {
        window.removeEventListener(
          "deviceorientation",
          instance.onDeviceOrientationChange
        );
      }
    },
    keyHandlers: new Map<KeyCodes, () => void>(),
    keySingleHandlers: new Map<KeyCodes, () => void>(),
  };

  if (instance.onDeviceOrientationChange && useOrientation) {
    window.addEventListener(
      "deviceorientation",
      instance.onDeviceOrientationChange
    );
  }

  document.onkeydown = instance.onKeyDown;
  document.onkeyup = instance.onKeyUp;
  return instance;
};

export enum KeyCodes {
  backspace = 8,
  tab = 9,
  enter = 13,
  shift = 16,
  ctrl = 17,
  alt = 18,
  pause = 19,
  capsLock = 20,
  escape = 27,
  space = 32,
  pageUp = 33,
  pageDown = 34,
  end = 35,
  home = 36,
  leftArrow = 37,
  upArrow = 38,
  rightArrow = 39,
  downArrow = 40,
  insert = 45,
  delete = 46,
  key_0 = 48,
  key_1 = 49,
  key_2 = 50,
  key_3 = 51,
  key_4 = 52,
  key_5 = 53,
  key_6 = 54,
  key_7 = 55,
  key_8 = 56,
  key_9 = 57,
  keyA = 65,
  keyB = 66,
  keyC = 67,
  keyD = 68,
  keyE = 69,
  keyF = 70,
  keyG = 71,
  keyH = 72,
  keyI = 73,
  keyJ = 74,
  keyK = 75,
  keyL = 76,
  keyM = 77,
  keyN = 78,
  keyO = 79,
  keyP = 80,
  keyQ = 81,
  keyR = 82,
  keyS = 83,
  keyT = 84,
  keyU = 85,
  keyV = 86,
  keyW = 87,
  keyX = 88,
  keyY = 89,
  keyZ = 90,
  leftMeta = 91,
  rightMeta = 92,
  select = 93,
  numpad_0 = 96,
  numpad_1 = 97,
  numpad_2 = 98,
  numpad_3 = 99,
  numpad_4 = 100,
  numpad_5 = 101,
  numpad_6 = 102,
  numpad_7 = 103,
  numpad_8 = 104,
  numpad_9 = 105,
  multiply = 106,
  add = 107,
  subtract = 109,
  decimal = 110,
  divide = 111,
  f1 = 112,
  f2 = 113,
  f3 = 114,
  f4 = 115,
  f5 = 116,
  f6 = 117,
  f7 = 118,
  f8 = 119,
  f9 = 120,
  f10 = 121,
  f11 = 122,
  f12 = 123,
  numLock = 144,
  scrollLock = 145,
  semicolon = 186,
  equals = 187,
  comma = 188,
  dash = 189,
  period = 190,
  forwardSlash = 191,
  graveAccent = 192,
  openBracket = 219,
  backSlash = 220,
  closeBracket = 221,
  singleQuote = 222,
}

export default createInputHandler;
