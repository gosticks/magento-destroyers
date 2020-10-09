import React from "react";
import styled from "styled-components";

const StyledScore = styled.div`
  position: absolute;
  left: 5%;
  top: 5%;
  color: #fff;
`;

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

export default Score;
