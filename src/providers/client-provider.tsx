"use client";

import React from "react";

import { ColorModeProvider, js_design_tokens } from "@usefui/tokens";

import {
  generateColorClasses,
  generateCSSVariables,
  generateDimensionClasses,
  generateFontSizesClasses,
  generateLayoutClasses,
  generateOpacityClasses,
  generateSizeClasses,
} from "@usefui/core";

import { createGlobalStyle } from "styled-components";
import { ResetStyles, TypographyRoot } from "@usefui/styles";

const { design_tokens } = js_design_tokens;

const cssLayoutClasses = generateLayoutClasses();
const cssWidthHeightClasses = generateDimensionClasses();
const cssSizeClasses = generateSizeClasses(design_tokens.measurement);
const cssFSClasses = generateFontSizesClasses(design_tokens.fontsize);
const cssOpacityClasses = generateOpacityClasses(design_tokens.opacity);
const cssColorClasses = generateColorClasses(
  js_design_tokens.design_tokens.color,
);

const cssVariables = generateCSSVariables({
  name: js_design_tokens.name,
  design_tokens: {
    color: design_tokens.color,
    measurement: design_tokens.measurement,
    fontsize: design_tokens.fontsize,
    opacity: design_tokens.opacity,
    depth: design_tokens.depth,
  },
});

const CSSRoot = createGlobalStyle`
	:root {
		${cssVariables.color}
		${cssVariables.alpha}
		${cssVariables.tint}
		${cssVariables.shade}
		${cssVariables.fontsize}
		${cssVariables.measurement}
		${cssVariables.depth}
		${cssVariables.opacity}

		${cssSizeClasses}
		${cssFSClasses}
		${cssOpacityClasses}
		${cssColorClasses}
		${cssLayoutClasses}
    ${cssWidthHeightClasses}

    --breakpoint-mobile: 375px;
		--breakpoint-mobile-large: 425px;
		--breakpoint-tablet-small: 672px;
		--breakpoint-tablet: 768px;
		--breakpoint-tablet-landscape: 1024px;
		--breakpoint-desktop-small: 1240px;
		--breakpoint-desktop: 1440px;
		--breakpoint-desktop-large: 1589px;

    --font-mono: "berkeleyMono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;

    kbd, pre, code {
      font-family: var(--font-mono);
    }
	}
`;

export function ClientProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const colorModeConfig = React.useMemo(
    () => ({
      body: {
        light: "var(--color-mono-white)",
        dark: "var(--color-mono-darkest)",
      },
      contrast: {
        light: "var(--color-mono-light)",
        dark: "var(--color-mono-darker)",
      },
    }),
    [],
  );

  return (
    <ColorModeProvider config={colorModeConfig}>
      <ResetStyles />
      <TypographyRoot />
      <CSSRoot />

      {children}
    </ColorModeProvider>
  );
}
