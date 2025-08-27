"use client";

import React from "react";
import styled from "styled-components";

const IFrame = styled.iframe`
  display: block;
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
      key={sandboxKey}
      src={sandboxUrl}
      className="h-100 w-100"
      sandbox="allow-forms allow-scripts"
      title="Project preview"
      referrerPolicy="no-referrer"
      loading="lazy"
    />
  );
}

export default ProjectPreview;
