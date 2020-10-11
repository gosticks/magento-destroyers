import React from "react";
import styled from "styled-components";
import { KeyCodes, requestOrientation } from "../game/utils/inputHandler";
import useKeypress from "../utils/hooks/useKeypress";
import StyledButton from "./Button";
import StyledOverlay from "./Overlay";

interface StartScreenProps {
  onStart: () => void;
  isGameOver: boolean;
  isNewHigh: boolean;
  score: number;
}

const StyledGameOver = styled.div`
  font-size: 2rem;
  @media screen and (min-width: 768px) {
    font-size: 3rem;
  }
  margin-bottom: 2rem;
`;

const MDLogo = styled.img`
  margin-bottom: 2rem;
`;

const StartScreen: React.FC<StartScreenProps> = ({
  isGameOver,
  onStart,
  score,
}) => {
  useKeypress(KeyCodes.space, () => {
    requestOrientation();
    onStart();
  });

  return (
    <StyledOverlay>
      <div>
        <MDLogo
          src="/magento-destroyers-logo.svg"
          width={isGameOver ? 80 : 200}
          alt="Magento Destroyers"
        />
        {!isGameOver && (
          <StyledGameOver>
            Magento <br /> Destroyers
          </StyledGameOver>
        )}
        {isGameOver && (
          <>
            <StyledGameOver>GAME OVER</StyledGameOver>
            <p>Magento has ruined your life...</p>
            <br />
            <br />
            <br />
          </>
        )}
        <p>
          {isGameOver ? "Press space to try again" : "Press space to start"}
        </p>
        <br />
        <br />
        <div>
          <StyledButton
            onClick={() => {
              // request for gestures
              requestOrientation();
              onStart();
            }}
          >
            START GAME
          </StyledButton>
        </div>
      </div>
    </StyledOverlay>
  );
};

export default StartScreen;
