import React from "react";
import styled from "styled-components";
import { Github } from "@styled-icons/boxicons-logos/Github";

const StyledNav = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  top: 2vmin;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  color: #eee;
  z-index: 10;
`;

const StyledAnchor = styled.a`
  opacity: 0.8;
  transition: 0.1s opacity ease-in;
  color: #fff;

  &::active,
  &::visited {
    color: #fff;
  }

  &:hover {
    opacity: 0.2;
  }
`;

const Nav = (props: {}) => {
  return (
    <StyledNav>
      <StyledAnchor href="https://iamwlad.com">
        <img
          src="/outline-icon-small.svg"
          height={60}
          alt="go to iamwlad.com"
        />
      </StyledAnchor>
      <StyledAnchor href="https://github.com/gosticks/magento-destroyers">
        <Github size={60} />
      </StyledAnchor>
    </StyledNav>
  );
};

export default Nav;
