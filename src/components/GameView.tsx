import React, { useRef, useEffect } from "react";
import Game from "../game/Game";

export interface CanvasProps {
  width: number;
  height: number;
  onScoreChanged: (newScore: number, oldScore: number, extra: any) => void;
}

export default (props: CanvasProps) => {
  const container = useRef<HTMLCanvasElement | undefined>();
  const game = useRef<Game | undefined>();

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
      game.current.onScoreChanged = props.onScoreChanged;
    }
  }, [props.onScoreChanged, game]);

  // FIXME: read up on ref usage with modern TS
  return <div ref={container as any}></div>;
};