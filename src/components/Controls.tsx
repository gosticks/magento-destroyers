import React from "react";
import styled from "styled-components";

const KeyBox = styled.span`
  display: inline-block;
  border: 2px solid #eee;
  font-size: 1.4rem;
  padding: 0.5rem 0.9rem;
`;

const KeyBlock = styled.span`
  display: inline-block;
  white-space: nowrap;
`;

const ControlsContainer = styled.div<{ embed?: boolean }>`
  margin-top: 2rem;
  margin-left: 2rem;
  margin-right: 2rem;
  color: #eee;
  padding: 0.5rem;
  text-align: left;
  transform: scale(${(props) => (props.embed ? 0.7 : 1)});
`;

const Controls: React.FC<{ embed?: boolean }> = (props) => {
  return (
    <ControlsContainer {...props}>
      <b>CONTROLS: </b>
      <KeyBlock>
        <KeyBox>←</KeyBox> = move left,
      </KeyBlock>
      <KeyBlock>
        <KeyBox>→</KeyBox> = move right,
      </KeyBlock>
      <KeyBlock>
        <KeyBox>SPACE</KeyBox> = shoot,
      </KeyBlock>
      <KeyBlock>
        <KeyBox>ESC</KeyBox> = pase
      </KeyBlock>
    </ControlsContainer>
  );
};

export default Controls;
