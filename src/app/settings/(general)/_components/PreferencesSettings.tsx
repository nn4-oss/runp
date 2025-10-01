"use client";

import React from "react";

import { ColorModes, BorderWrapper } from "@/components";

function PreferencesSettings() {
  return (
    <BorderWrapper className="p-medium-60">
      <div className="flex align-center justify-between g-medium-10">
        <hgroup className="w-100 grid g-medium-10">
          <h6 className="fs-medium-20">Preferences</h6>
          <p className="fs-medium-10 opacity-default-60">
            Choose your preferred color scheme.
          </p>
        </hgroup>

        <ColorModes />
      </div>
    </BorderWrapper>
  );
}

export default PreferencesSettings;
