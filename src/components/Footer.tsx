import React from "react";
import styled from "styled-components";

const StyledFooter = styled.footer`
  @media screen and (min-width: 768px) {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0.5rem;
  }
  padding: 0.5rem;
  text-align: center;
  justify-content: space-between;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  color: #222;
  z-index: 10;
`;

const Footer = (props: {}) => {
  return (
    <StyledFooter>
      <p>
        The Magento name and its related logos are trademarks owned by Magento,
        Inc.
      </p>
    </StyledFooter>
  );
};

export default Footer;
