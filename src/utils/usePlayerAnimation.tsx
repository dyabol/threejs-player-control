import { useEffect, useRef } from "react";
import { useFrame } from "react-three-fiber";
import { AnimationAction, AnimationClip, AnimationMixer, Group } from "three";
import { useKeyState } from "./services/KeyService";

const usePlayerAnimation = (scene: Group, animations: AnimationClip[]) => {
  const playerPrevState = useRef<string | null>("idle");
  const playerState = useRef<string>("idle");
  const mixer = new AnimationMixer(scene);
  const actions: { [key: string]: AnimationAction } = {
    idle: mixer.clipAction(AnimationClip.findByName(animations, "Idle")),
    walk: mixer.clipAction(AnimationClip.findByName(animations, "Walk")),
    run: mixer.clipAction(AnimationClip.findByName(animations, "Run")),
  };

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  useEffect(() => {
    actions.idle.play();
  }, []);

  useKeyState((keys) => {
    if (keys.forward || keys.backward) {
      if (keys.run) {
        playerState.current = "run";
      } else {
        playerState.current = "walk";
      }
    } else {
      playerState.current = "idle";
    }
  });

  useFrame(() => {
    if (playerState.current !== playerPrevState.current) {
      switch (playerState.current) {
        case "walk":
          walk();
          break;
        case "idle":
          idle();
          break;
        case "run":
          run();
          break;
      }
      playerPrevState.current = playerState.current;
    }
  });

  const walk = () => {
    debugger;
    const curAction = actions.walk;
    if (playerPrevState.current) {
      const prevAction = actions[playerPrevState.current];
      curAction.enabled = true;

      if (playerPrevState.current === "run") {
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

  const idle = () => {
    const idleAction = actions.idle;
    if (playerPrevState.current) {
      const prevAction = actions[playerPrevState.current];
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

  const run = () => {
    const curAction = actions.run;
    if (playerPrevState.current) {
      const prevAction = actions[playerPrevState.current];

      curAction.enabled = true;

      if (playerPrevState.current === "walk") {
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
};

export default usePlayerAnimation;
