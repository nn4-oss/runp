"use client";

import React from "react";

import { ColorModes } from "@/components";
import { Card } from "@usefui/components";

function PreferencesSettings() {
  return (
    <Card.Body className="p-medium-60">
      <div className="flex align-center justify-between g-medium-10">
        <hgroup className="w-100 grid g-medium-10">
          <h6 className="fs-medium-20">Preferences</h6>
          <p className="fs-medium-10 opacity-default-60">
            Choose your preferred color scheme.
          </p>
        </hgroup>

        <ColorModes />
      </div>
    </Card.Body>
  );
}

export default PreferencesSettings;
