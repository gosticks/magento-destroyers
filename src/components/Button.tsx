import styled from "styled-components";

const StyledButton = styled.button`
  display: inline-block;
  background-color: transparent;
  outline: 0;
  border-radius: 0;
  border: 4px solid #fff;
  color: #fff;
  padding: 0.9rem;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    border-color: #ccc;
    color: #ccc;
  }
`;

export default StyledButton;
