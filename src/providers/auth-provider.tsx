"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import {
  useColorMode,
  GetColorTokenBase,
  GetTokenFromSource,
  js_design_tokens,
} from "@usefui/tokens";

export function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { colorMode } = useColorMode();

  const colors = () => {
    if (colorMode === "dark") {
      return {
        body: GetColorTokenBase({
          source: js_design_tokens,
          token_category: "color",
          query: "mono-darker",
        }),
        font: GetColorTokenBase({
          source: js_design_tokens,
          token_category: "color",
          query: "mono-white",
        }),
      };
    }

    return {
      body: GetColorTokenBase({
        source: js_design_tokens,
        token_category: "color",
        query: "mono-white",
      }),
      font: GetColorTokenBase({
        source: js_design_tokens,
        token_category: "color",
        query: "mono-darkest",
      }),
    };
  };

  const borderRadius = `${
    GetTokenFromSource({
      source: js_design_tokens,
      token_category: "measurement",
      query: "medium",
      unit: "px",
    })?.base
  }px`;

  return (
    <ClerkProvider
      afterSignOutUrl={"/sign-up"}
      appearance={{
        layout: {
          animations: false,
        },
        variables: {
          borderRadius,
          colorBackground: colors().body,
          colorInputBackground: colors().body,
          colorPrimary: `${colors().font}60`,
          colorTextSecondary: colors().font,
          colorTextOnPrimaryBackground: colors().body,
          colorInputText: colors().font,
          colorNeutral: colors().font,
          colorText: colors().font,
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
