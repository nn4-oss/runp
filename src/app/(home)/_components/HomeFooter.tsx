"use client";
import React from "react";
import styled from "styled-components";

import { ColorModes } from "@/components";
import { Badge } from "@usefui/components";

const FooterWrapper = styled.footer`
  flex-wrap: wrap;
  width: 100%;
  margin: 0 auto;
  a {
    text-decoration: none;
  }
`;

function HomeFooter() {
  return (
    <FooterWrapper className="p-medium-60 flex justify-between align-center g-medium-60">
      <p className="fs-medium-10">
        <span className="opacity-default-60">Built by</span>&nbsp;
        <a target="_blank" href="https://github.com/nnsncl">
          nnsncl
        </a>
        <span className="opacity-default-60">&nbsp;at&nbsp;</span>
        <a target="_blank" href="https://github.com/foundation-ui">
          Foundation UI
        </a>
      </p>

      <Badge variant="border">
        <ColorModes />
      </Badge>
    </FooterWrapper>
  );
}

export default HomeFooter;
