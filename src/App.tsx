import React, { useRef, useState } from "react";
import "./App.css";
import Game from "./components/GameView";
import styled, { createGlobalStyle } from "styled-components";
import PauseOverlay from "./components/PauseOverlay";
import ControlDelegate from "./game/ControlDelegate";
import StartScreen from "./components/StartScreen";

createGlobalStyle`
  body {
    font-family: "Press Start 2P", cursive;
    color: #000;
    background-color: #000;
  }
`;

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

const AppContainer = styled.div`
  position: relative;
  max-width: 1920px;
  margin-left: 0;
  margin-right: 0;
`;

const StyledScore = styled.div`
  position: absolute;
  left: 5%;
  top: 5%;
  color: #fff;
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
`;

const StyledTvOverlay = styled.img`
  display: block;
  width: 100%;
  z-index: 10;
  position: relative;
`;

const StyledGame = styled(Game)``;

const GameContainer = styled.div`
  position: absolute;
  left: 13%;
  top: 18%;
`;

const App = () => {
  const [paused, setPaused] = useState(false);
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);

  const gameDelegate = useRef<ControlDelegate>({
    onComplete: () => alert("you have completed the level"),
    onResumed: () => setPaused(false),
    onPaused: () => setPaused(true),
    onScoreChanged: (value: number) => setScore(value),
    onStartGame: () => setStarted(true),
  });

  return (
    <div className="App">
      <AppContainer>
        <GameContainer>
          <StyledGame delegate={gameDelegate.current} started={started} />
          {started && (
            <>
              <Score score={score} />
              <Overlay />
            </>
          )}
          {paused && <PauseOverlay />}
          {!started && <StartScreen onStart={() => setStarted(true)} />}
        </GameContainer>
        <StyledTvOverlay src="/screen.png" />
      </AppContainer>
    </div>
  );
};

export default App;
