import React from "react";
import StyledOverlay from "./Overlay";

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
