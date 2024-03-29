import styled from "styled-components";

const StyledOverlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;

  > div {
    max-width: 90%;
  }
`;

export default StyledOverlay;
