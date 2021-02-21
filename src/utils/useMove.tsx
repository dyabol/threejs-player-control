import { useEffect, useRef } from "react";
import _ from "lodash";
import { useFrame } from "react-three-fiber";
import { AnimationAction } from "three";

type PlayerState = "idle" | "walk" | "run";

type Props = {
  actions: { [key: string]: AnimationAction };
};

type UseMove = {
  playerState: PlayerState;
  playerPrevState: PlayerState | null;
  space: boolean;
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shift: boolean;
};

const useMove = ({ actions }: Props) => {
  const ref = useRef<UseMove>({
    playerPrevState: null,
    playerState: "idle",
    space: false,
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false,
  });

  const walk = (playerPrevState: PlayerState | null) => {
    const curAction = actions.walk;
    if (playerPrevState) {
      const prevAction = actions[playerPrevState];
      curAction.enabled = true;

      if (playerPrevState === "run") {
        const ratio =
          curAction.getClip().duration / prevAction.getClip().duration;
        curAction.time = prevAction.time * ratio;
      } else {
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
      }
      curAction.crossFadeFrom(prevAction, 0.1, true);
      curAction.play();
    } else {
      curAction.play();
    }
  };

  const idle = (playerPrevState: PlayerState | null) => {
    const idleAction = actions.idle;
    if (playerPrevState) {
      const prevAction = actions[playerPrevState];
      idleAction.time = 0.0;
      idleAction.enabled = true;
      idleAction.setEffectiveTimeScale(1.0);
      idleAction.setEffectiveWeight(1.0);
      idleAction.crossFadeFrom(prevAction, 0.25, true);
      idleAction.play();
    } else {
      idleAction.play();
    }
  };

  const run = (playerPrevState: PlayerState | null) => {
    const curAction = actions.run;
    if (playerPrevState) {
      const prevAction = actions[playerPrevState];

      curAction.enabled = true;

      if (playerPrevState === "walk") {
        const ratio =
          curAction.getClip().duration / prevAction.getClip().duration;
        curAction.time = prevAction.time * ratio;
      } else {
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
      }

      curAction.crossFadeFrom(prevAction, 0.1, true);
      curAction.play();
    } else {
      curAction.play();
    }
  };

  useFrame(() => {
    const { playerPrevState, playerState } = ref.current;
    if (playerState !== playerPrevState) {
      switch (playerState) {
        case "walk":
          walk?.(playerPrevState);
          break;
        case "idle":
          idle?.(playerPrevState);
          break;
        case "run":
          run?.(playerPrevState);
          break;
        default:
          break;
      }
      ref.current.playerPrevState = playerState;
    }
  });

  const update = (keys: UseMove) => {
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
    const prevKeys = { ...ref.current };
    const keys = ref.current;
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
    const keys = ref.current;
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
