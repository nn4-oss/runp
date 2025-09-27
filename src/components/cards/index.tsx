"use client";

import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  width: 100%;
  background-color: var(--font-color-alpha-10);
  border-radius: var(--measurement-medium-30);
`;
const CardWrapper = styled.div`
  background-color: var(--contrast-color);
  border: var(--measurement-small-30) solid var(--font-color-alpha-10);
  border-radius: var(--measurement-medium-30);
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--measurement-large-90), 1fr)
  );
  grid-gap: var(--measurement-medium-30) var(--measurement-medium-30);
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
`;

function Card({
  footer,
  children,
}: {
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <CardContainer>
      <CardWrapper className="p-medium-60 w-100">{children}</CardWrapper>
      {footer}
    </CardContainer>
  );
}

export default Card;
