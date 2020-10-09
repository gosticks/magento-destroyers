import React, { useRef, useState } from "react";
import "./App.css";
import Game from "./components/GameView";
import styled, { createGlobalStyle } from "styled-components";
import PauseOverlay from "./components/PauseOverlay";
import ControlDelegate from "./game/ControlDelegate";
import StartScreen from "./components/StartScreen";
import ComputerMonitor from "./components/ComputerMonitor";
import { parse } from "url";
import Controls from "./components/Controls";
import Score from "./components/Score";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

createGlobalStyle`
  body {
    font-family: "Press Start 2P", cursive;
    color: #000;
    background-color: #000;
  }
`;

const AppContainer = styled.div`
  position: relative;
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
      <Nav />
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
      <Footer />
    </div>
  );
};

export default App;
