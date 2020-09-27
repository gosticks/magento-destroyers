import React, { useRef, useEffect, useState } from "react";
import ControlDelegate from "../game/ControlDelegate";
import Game from "../game/Game";
import LevelOverlay from "./LevelOverlay";

export interface CanvasProps {
  width: number;
  height: number;
  delegate: ControlDelegate;
  started: boolean;
}

export default (props: CanvasProps) => {
  const container = useRef<HTMLCanvasElement | undefined>();
  const game = useRef<Game | undefined>();

  useEffect(() => {
    game.current?.onStartGame();
  }, [props.started]);

  // setup gl and canvas when it is setup
  useEffect(() => {
    if (!container.current) {
      return;
    }
    game.current = new Game(props.width, props.height, container.current);
    return () => {
      // TODO: perform any future cleanup here
    };
  }, [container, props.height, props.width]);

  useEffect(() => {
    if (game.current) {
      game.current.delegate = props.delegate;
    }
  }, [props.delegate, game]);

  // FIXME: read up on ref usage with modern TS
  return (
    <>
      <div ref={container as any}></div>
      {/* {<LevelOverlay level={1} />} */}
    </>
  );
};
