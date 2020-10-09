import React, { useRef, useState } from "react";
import "./App.css";
import Game from "./components/GameView";
import styled, { createGlobalStyle } from "styled-components";
import PauseOverlay from "./components/PauseOverlay";
import ControlDelegate from "./game/ControlDelegate";
import StartScreen from "./components/StartScreen";
import ComputerMonitor from "./components/ComputerMonitor";
import { parse } from "url";

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

const Score = (props: { score: number; highScore?: number }) => {
  return (
    <StyledScore>
      <h3>
        SCORE:
        {props.score.toLocaleString("en", {
          minimumIntegerDigits: 8,
          useGrouping: false,
        })}
      </h3>
      {props.highScore && (
        <h5>
          HIGH SCORE:
          {props.highScore.toLocaleString("en", {
            minimumIntegerDigits: 8,
            useGrouping: false,
          })}
        </h5>
      )}
    </StyledScore>
  );
};

const AppContainer = styled.div`
  position: relative;
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

const StyledGame = styled(Game)``;

const STORAGE_KEY = "highScore";

const persistHighScore = (newScore: number) => {
  const oldScore = getHighScore();
  if (!oldScore) {
    localStorage.setItem(STORAGE_KEY, newScore + "");
    return true;
  }

  if (oldScore < newScore) {
    localStorage.setItem(STORAGE_KEY, newScore + "");
    return true;
  }
  return false;
};

const getHighScore = () => {
  const score = localStorage.getItem(STORAGE_KEY);
  if (score) {
    return parseInt(score);
  }
  return undefined;
};

const App = () => {
  const [paused, setPaused] = useState(false);
  const [highScore, setHighScore] = useState(getHighScore());
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [isNewHighScore, setNewHighScore] = useState(false);
  const [isGameOver, setGameOver] = useState(false);

  const gameDelegate = useRef<ControlDelegate>({
    onComplete: () => alert("you have completed the level"),
    onResumed: () => setPaused(false),
    onPaused: () => setPaused(true),
    onScoreChanged: (value: number) => setScore(value),
    onStartGame: () => {
      setScore(0);
      setGameOver(false);
      setStarted(true);
    },
    onGameOver: (score) => {
      console.log("Score:", score);
      const newHighScoreSet = persistHighScore(score);
      setNewHighScore(newHighScoreSet);
      if (newHighScoreSet) {
        setHighScore(score);
      }
      setGameOver(true);
    },
  });

  return (
    <div className="App">
      <AppContainer>
        <ComputerMonitor>
          <StyledGame
            delegate={gameDelegate.current}
            gameOver={isGameOver}
            started={started}
          />
          {started && (
            <>
              <Score score={score} highScore={highScore} />
              <Overlay />
            </>
          )}
          {paused && <PauseOverlay />}
          {(!started || isGameOver) && (
            <StartScreen
              isNewHigh={isNewHighScore}
              isGameOver={isGameOver}
              score={score}
              onStart={() => {
                setStarted(true);
                setGameOver(false);
              }}
            />
          )}
        </ComputerMonitor>
      </AppContainer>
    </div>
  );
};

export default App;
