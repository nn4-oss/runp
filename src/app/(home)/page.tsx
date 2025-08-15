"use client";

import React from "react";

import LandingHeading from "./_components/LandingHeading";
import PromptField from "./_components/PromptField";
import AnimatedHero from "./_components/AnimatedHero";

function LandingPage() {
  return (
    <div className="h-100 w-100" style={{ position: "relative" }}>
      <LandingHeading />
      <PromptField />
      <AnimatedHero chars="runp" />
    </div>
  );
}

export default LandingPage;
