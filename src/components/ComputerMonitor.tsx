import React from "react";
import styled from "styled-components";

const StyledMonitorContainer = styled.div`
  display: flex;
  height: 95vh;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const StyledMonitor = styled.div`
  width: 80vmin;
  height: 65vmin;
  position: relative;
  background: rgb(193, 193, 193);
  background: linear-gradient(
    125deg,
    rgba(193, 193, 193, 1) 0%,
    rgba(144, 144, 144, 1) 100%
  );
  padding: 5vmin;
  border-radius: 1rem;
`;

const StyledInnerScreen = styled.div`
  position: relative;
  background-color: #000;
  border-radius: 3rem;
  overflow: hidden;
  border: 0.5rem solid #777;
  height: 92%;
`;

const ScreenButtonRow = styled.div`
  position: absolute;
  right: 5vmin;
  bottom: 3vmin;
  padding-right: 2vmin;
  display: flex;
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
    </StyledMonitorContainer>
  );
};

export default ComputerMonitor;
