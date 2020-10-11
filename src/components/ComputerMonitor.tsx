import React from "react";
import styled from "styled-components";
import Controls from "./Controls";

const StyledMonitorContainer = styled.div`
  user-select: none;
  position: relative;
  width: 100%;
  height: 100vh;

  @media screen and (min-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const StyledMonitor = styled.div`
  width: 100%;
  height: 100vh;

  @media screen and (min-width: 768px) {
    width: 80vmin;
    height: 65vmin;
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

const PowerIndicator = styled.div`
  width: 1vmin;
  height: 1vmin;
  border-radius: 50%;
  background-color: #218c74;
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
`;

const ComputerMonitor: React.FC = (props) => {
  return (
    <StyledMonitorContainer>
      <StyledMonitor>
        <StyledInnerScreen id="inner-screen">
          {props.children}
        </StyledInnerScreen>
        <ScreenButtonRow>
          <PowerButton>POWER</PowerButton>
          <PowerIndicator />
        </ScreenButtonRow>
      </StyledMonitor>

      <Controls />
    </StyledMonitorContainer>
  );
};

export default ComputerMonitor;
