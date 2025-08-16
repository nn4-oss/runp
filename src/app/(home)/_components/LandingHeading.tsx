"use client";

import styled from "styled-components";

const HeadingGroup = styled.hgroup`
  text-align: center;

  h1 {
    font-size: clamp(var(--fontsize-large-30), 8vw, var(--fontsize-large-60));
    font-weight: 500 !important;
    letter-spacing: calc((1.1618px * 2) * -1);
  }
`;

function LandingHeading() {
  return (
    <HeadingGroup className="grid align-center justify-center g-medium-10">
      <h1>Build features using prompts</h1>
      <p className="fs-medium-30 opacity-default-60">
        Build production ready apps and features by chatting with AI
      </p>
    </HeadingGroup>
  );
}

export default LandingHeading;
