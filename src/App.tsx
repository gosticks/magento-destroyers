import React from "react";
import "./App.css";
import Game from "./game/Game";
import styled from "styled-components";

const Overlay = () => {
  return (
    <StyledOverlay>
      <h1>CLEAR ALL MAGENTO TASKS</h1>
    </StyledOverlay>
  );
};

const Score = () => {
  return (
    <StyledScore>
      <h2>SCORE: 00000000</h2>
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
  return (
    <div className="App">
      <Game width={window.innerWidth} height={window.innerHeight} />
      <Score />
      <Overlay />
    </div>
  );
}

export default App;
