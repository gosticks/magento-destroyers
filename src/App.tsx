import React, { useRef, useState } from "react";
import "./App.css";
import Game from "./components/GameView";
import styled from "styled-components";
import PauseOverlay from "./components/PauseOverlay";
import ControlDelegate from "./game/ControlDelegate";

const Overlay = () => {
  return (
    <StyledOverlay>{/* <h1>CLEAR ALL MAGENTO TASKS</h1> */}</StyledOverlay>
  );
};

const Score = (props: { score: number }) => {
  return (
    <StyledScore>
      <h2>
        SCORE:
        {props.score.toLocaleString("en", {
          minimumIntegerDigits: 8,
          useGrouping: false,
        })}
      </h2>
    </StyledScore>
  );
};

const StyledScore = styled.div`
  position: absolute;
  left: 25px;
  top: 25px;
  color: #fff;
  font-family: "Press Start 2P", cursive;
`;
const StyledOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-family: "Press Start 2P", cursive;
`;

const App = () => {
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);

  const gameDelegate = useRef<ControlDelegate>({
    onComplete: () => alert("you have completed the level"),
    onResumed: () => setPaused(false),
    onPaused: () => setPaused(true),
    onScoreChanged: (value: number) => setScore(value),
  });

  return (
    <div className="App">
      <Game
        delegate={gameDelegate.current}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <Score score={score} />
      <Overlay />
      {paused && <PauseOverlay />}
    </div>
  );
};

export default App;
