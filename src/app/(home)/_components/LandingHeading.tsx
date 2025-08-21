"use client";

import React from "react";
import styled from "styled-components";

const HeadingGroup = styled.hgroup`
  text-align: center;

  h1 {
    font-size: clamp(var(--fontsize-large-30), 5vw, var(--fontsize-large-60));
    font-weight: 500 !important;
    letter-spacing: calc((1.1618px * 2) * -1);

    /* background: linear-gradient(
      to right,
      var(--font-color-alpha-60),
      var(--font-color) 100%
    ); */
    /* -webkit-background-clip: text; */
    /* background-clip: text; */

    /* mix-blend-mode: luminosity; */
    /* color: transparent; */
  }
`;

function LandingHeading() {
  return (
    <HeadingGroup className="grid align-center justify-center g-medium-10">
      <h1>Ideas to features in seconds</h1>
      <p className="fs-medium-30 opacity-default-30">
        Create advanced features by chatting with AI
      </p>
    </HeadingGroup>
  );
}

export default LandingHeading;
