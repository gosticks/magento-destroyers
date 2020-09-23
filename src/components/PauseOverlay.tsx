import React from "react";
import styled from "styled-components";

const StyledOverlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Press Start 2P", cursive;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
`;

const PauseOverlay = () => {
  return (
    <StyledOverlay>
      <div>
        <h2>GAME PAUSED</h2>
        <p>Press ESC to resume</p>
      </div>
    </StyledOverlay>
  );
};

export default PauseOverlay;
