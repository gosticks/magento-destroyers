import React, { useRef, useEffect, useState } from "react";
import ControlDelegate from "../game/ControlDelegate";
import Game from "../game/Game";
import LevelOverlay from "./LevelOverlay";

export interface CanvasProps {
  delegate: ControlDelegate;
  started: boolean;
  className?: string;
}

const getGameSize = () => {
  const el = document.getElementById("inner-screen");
  if (el) {
    const bounds = el.getBoundingClientRect();
    return { width: bounds.width, height: bounds.height };
  }
  const width = Math.min(window.innerWidth, 1920) * 0.58;
  const height = width * 0.78;

  return { width, height };
};

const createGameInstance = (target: HTMLElement) => {
  const size = getGameSize();
  return new Game(
    size.width,
    size.height,
    window.devicePixelRatio ?? 1,
    target
  );
};

export default (props: CanvasProps) => {
  const container = useRef<HTMLCanvasElement | undefined>();
  const game = useRef<Game | undefined>();

  useEffect(() => {
    game.current?.onStartGame();
  }, [props.started]);

  // setup resize handler
  useEffect(() => {
    const windowResizeHandler = (e: Event) => {
      if (!game.current) {
        return;
      }
      const newSize = getGameSize();
      game.current.updateSize(newSize.width, newSize.height);
    };

    window.addEventListener("resize", windowResizeHandler);
    return () => window.removeEventListener("resize", windowResizeHandler);
  }, [game]);

  // setup gl and canvas when it is setup
  useEffect(() => {
    if (!container.current) {
      return;
    }

    game.current = createGameInstance(container.current);

    return () => {
      // TODO: perform any future cleanup here
    };
  }, [container]);

  useEffect(() => {
    if (game.current) {
      game.current.delegate = props.delegate;
    }
  }, [props.delegate, game]);

  // FIXME: read up on ref usage with modern TS
  return (
    <>
      <div className={props.className} ref={container as any}></div>
      {/* {<LevelOverlay level={1} />} */}
    </>
  );
};
