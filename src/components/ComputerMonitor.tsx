import React from "react";
import styled, { css } from "styled-components";
import Controls from "./Controls";

const StyledMonitorContainer = styled.div<{ embed?: boolean }>`
  user-select: none;
  position: relative;
  width: 100%;
  height: 100vh;

  ${(props) =>
    !props.embed &&
    css`
      @media screen and (min-width: 768px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    `}
`;

const StyledMonitor = styled.div<{ embed?: boolean }>`
  width: 100%;
  height: 100vh;
  @media screen and (min-width: 768px) {
    ${(props) =>
      !props.embed &&
      css`
        width: 80vmin;
        height: 65vmin;
      `}
    padding: 5vmin;
    border-radius: 1rem;
    position: relative;
    background: rgb(193, 193, 193);
    background: linear-gradient(
      125deg,
      rgba(193, 193, 193, 1) 0%,
      rgba(144, 144, 144, 1) 100%
    );
  }
`;

const StyledInnerScreen = styled.div`
  position: relative;
  height: 95%;

  @media screen and (min-width: 768px) {
    height: 92%;
    background-color: #000;
    border-radius: 3rem;
    overflow: hidden;
    border: 0.5rem solid #777;
  }
`;

const ScreenButtonRow = styled.div`
  display: none;
  @media screen and (min-width: 768px) {
    display: flex;
  }
  position: absolute;
  right: 5vmin;
  bottom: 3vmin;
  padding-right: 2vmin;
  align-items: center;
`;

const PowerIndicator = styled.div<{ playing: boolean }>`
  width: 1vmin;
  height: 1vmin;
  border-radius: 50%;
  background-color: ${(props) => (props.playing ? "#218c74" : "red")};
  border: 0.25vmin solid #aaa;
`;

const PowerButton = styled.button`
  display: inline-block;
  padding: 1.2vmin;
  outline: 0;
  border: 0.25vmin solid #aaa;
  border-radius: 5%;
  background: #909090;
  color: #444;
  margin-right: 2vmin;
  cursor: pointer;

  &:hover {
    background: #808080;
  }

  &:active {
    background: #666363;
  }
`;

const ComputerMonitor: React.FC<{
  playing: boolean;
  embed?: boolean;
  onPowerClick?: () => void;
}> = ({ children, playing, onPowerClick, embed }) => {
  return (
    <StyledMonitorContainer embed={embed}>
      <StyledMonitor embed={embed}>
        <StyledInnerScreen id="inner-screen">{children}</StyledInnerScreen>
        <ScreenButtonRow>
          <PowerButton onClick={onPowerClick}>POWER</PowerButton>
          <PowerIndicator playing={playing} />
        </ScreenButtonRow>
      </StyledMonitor>

      <Controls />
    </StyledMonitorContainer>
  );
};

export default ComputerMonitor;
