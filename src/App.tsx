import React, { useState } from "react";
import "./App.css";
import Game from "./components/GameView";
import styled from "styled-components";

const Overlay = () => {
  return (
    <StyledOverlay>
      <h1>CLEAR ALL MAGENTO TASKS</h1>
    </StyledOverlay>
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

function App() {
  const [score, setScore] = useState(0);
  return (
    <div className="App">
      <Game
        onScoreChanged={setScore}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <Score score={score} />
      <Overlay />
    </div>
  );
}

export default App;
