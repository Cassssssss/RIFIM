import React from 'react';
import styled from 'styled-components';

const LogoImage = styled.img`
  display: block;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  object-fit: contain;

  html[data-theme='dark'] & {
    filter: brightness(0) invert(1);
  }
`;

// The adjacent RIFIM wordmark supplies the accessible brand name.
const RifimLogo = () => (
  <LogoImage
    src={`${process.env.PUBLIC_URL}/brand/rifim-hand.png`}
    width="40"
    height="40"
    alt=""
    aria-hidden="true"
    draggable="false"
  />
);

export default RifimLogo;
