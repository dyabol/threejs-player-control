import { useEffect, useRef } from "react";
import { useFrame } from "react-three-fiber";
import { AnimationAction, AnimationClip, AnimationMixer, Group } from "three";
import { Keys, subscribe } from "./services/Keyboard";

type Props = { scene: Group; animations: AnimationClip[] };

const PlayerAnimation: React.FC<Props> = ({ scene, animations }) => {
  const playerPrevState = useRef<string | null>("idle");
  const playerState = useRef<string>("idle");
  const mixer = new AnimationMixer(scene);
  const actions: { [key: string]: AnimationAction } = {
    idle: mixer.clipAction(AnimationClip.findByName(animations, "Idle")),
    walk: mixer.clipAction(AnimationClip.findByName(animations, "Walk")),
    run: mixer.clipAction(AnimationClip.findByName(animations, "Run")),
  };

  const getState = (keys: Keys) => {
    if (keys.forward || keys.backward) {
      if (keys.shift) {
        return "run";
      } else {
        return "walk";
      }
    }
    return "idle";
  };

  useEffect(
    () =>
      subscribe((keys) => {
        playerState.current = getState(keys);
      }),
    []
  );

  useEffect(() => {
    actions.idle.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    mixer.update(delta);
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

  return null;
};

export default PlayerAnimation;
