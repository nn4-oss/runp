"use client";

import React from "react";
import styled from "styled-components";

const HeadingGroup = styled.hgroup`
  text-align: center;

  h1 {
    font-size: clamp(var(--fontsize-large-30), 5vw, var(--fontsize-large-60));
    font-weight: 500 !important;
    letter-spacing: calc((1.1618px * 2) * -1);
  }
`;

function HomeHeading() {
  return (
    <HeadingGroup className="grid align-center justify-center m-b-medium-60">
      <h1>Ideas to features in seconds</h1>
      <p className="fs-medium-30 opacity-default-30">
        Start building with with prompts. No coding needed.
      </p>
    </HeadingGroup>
  );
}

export default HomeHeading;
