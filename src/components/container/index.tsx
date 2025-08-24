"use client";

import styled from "styled-components";
import { Page } from "@usefui/components";

export const AppContainer = styled(Page.Content)`
  background-color: var(--contrast-color);
  border-radius: var(--measurement-medium-30);

  border: var(--measurement-small-30) solid var(--font-color-alpha-10);
`;
