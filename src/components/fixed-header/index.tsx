"use client";

import styled from "styled-components";

export const FixedHeader = styled.hgroup`
  position: sticky;
  top: 0;
  background-color: var(--contrast-color);
  border-bottom: var(--measurement-small-30) solid var(--font-color-alpha-10);
  width: 100%;
  z-index: var(--depth-default-10);
`;
