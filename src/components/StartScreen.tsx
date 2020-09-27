import React from "react";
import { KeyCodes } from "../game/utils/inputHandler";
import useKeypress from "../utils/hooks/useKeypress";
import StyledButton from "./Button";
import StyledOverlay from "./Overlay";

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  useKeypress(KeyCodes.space, () => {
    onStart();
  });

  return (
    <StyledOverlay>
      <div>
        <h1>Press space to start</h1>
        <div>
          <StyledButton onClick={onStart}>START GAME</StyledButton>
        </div>
      </div>
    </StyledOverlay>
  );
};

export default StartScreen;
