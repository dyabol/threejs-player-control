import { useEffect, useRef } from "react";
import _ from "lodash";

type PlayerState = "idle" | "walk" | "run";

type UseMove = {
  playerState: PlayerState;
  playerPrevState: PlayerState | null;
};

type Keys = {
  space: boolean;
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shift: boolean;
};

const useMove = () => {
  const ref = useRef<UseMove>({
    playerPrevState: null,
    playerState: "idle",
  });
  const keysRef = useRef<Keys>({
    space: false,
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false,
  });

  const update = (keys: Keys) => {
    if (keys.up || keys.down) {
      ref.current.playerPrevState = ref.current.playerState;
      if (keys.shift) {
        ref.current.playerState = "run";
      } else {
        ref.current.playerState = "walk";
      }
    } else {
      ref.current.playerPrevState = ref.current.playerState;
      ref.current.playerState = "idle";
    }
  };

  const keyDown = (event: KeyboardEvent) => {
    //console.log("keyDown", event.key);
    const prevKeys = { ...keysRef.current };
    const keys = keysRef.current;
    switch (event.code.toLocaleLowerCase()) {
      case "space":
        keys.space = true;
        break;
      case "arrowup":
      case "keyw":
        keys.up = true;
        break;
      case "arrowdown":
      case "keys":
        keys.down = true;
        break;
      case "arrowleft":
      case "keya":
        keys.left = true;
        break;
      case "arrowright":
      case "keyd":
        keys.right = true;
        break;
      case "shiftleft":
      case "shiftright":
        keys.shift = true;
        break;
    }
    if (!_.isEqual(keys, prevKeys)) {
      console.log(keys, prevKeys);
      update(keys);
    }
  };

  const keyUp = (event: KeyboardEvent) => {
    //console.log("keyUp", event.key);
    const keys = keysRef.current;
    switch (event.code.toLocaleLowerCase()) {
      case "space":
        keys.space = false;
        break;
      case "arrowup":
      case "keyw":
        keys.up = false;
        break;
      case "arrowdown":
      case "keys":
        keys.down = false;
        break;
      case "arrowleft":
      case "keya":
        keys.left = false;
        break;
      case "arrowright":
      case "keyd":
        keys.right = false;
        break;
      case "shiftleft":
      case "shiftright":
        keys.shift = false;
        break;
    }
    update(keys);
  };

  useEffect(() => {
    window.addEventListener("keydown", keyDown, false);
    window.addEventListener("keyup", keyUp, false);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, []);

  return ref;
};
export default useMove;
