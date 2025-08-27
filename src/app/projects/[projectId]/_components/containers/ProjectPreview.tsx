"use client";

import React from "react";
import styled from "styled-components";

const IFrame = styled.iframe`
  all: unset;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: none;
  background-color: transparent;
`;

function ProjectPreview({
  sandboxUrl,
  sandboxKey,
}: {
  sandboxUrl: string;
  sandboxKey: number;
}) {
  return (
    <IFrame
      src={sandboxUrl}
      key={sandboxKey}
      className="h-100 w-100"
      sandbox="allow-forms allow-scripts allow-same-origin"
      loading="lazy"
    />
  );
}

export default ProjectPreview;
