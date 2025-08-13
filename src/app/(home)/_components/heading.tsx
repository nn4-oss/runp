"use client";

import styled from "styled-components";

import { Avatar } from "@usefui/components";
import { Icon, SocialIcon } from "@usefui/icons";

const FUIAvatar = styled(Avatar)`
  background: var(--font-color) !important;
  border-radius: var(--measurement-medium-30) !important;
  justify-self: center;
`;
const HeadingGroup = styled.hgroup`
  text-align: center;
`;

function Heading() {
  return (
    <div className="grid w-100 h-100 align-center justify-center">
      <HeadingGroup className="grid align-center justify-center g-medium-30">
        <FUIAvatar sizing="large">
          <Icon fill="var(--body-color)">
            <SocialIcon.Foundation />
          </Icon>
        </FUIAvatar>
        <h1 className="fs-large-10">Foundation UI - NextJS App</h1>
        <p className="fs-medium-20 opacity-default-60">
          Visit Foundation UI's&nbsp;
          <a href="https://usefui.dev" target="_blank">
            documentation
          </a>
          &nbsp;to learn more
        </p>
      </HeadingGroup>
    </div>
  );
}

export default Heading;
