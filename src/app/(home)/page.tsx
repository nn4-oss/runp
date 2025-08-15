"use client";

import React from "react";

import Heading from "./_components/heading";
import Hero from "./_components/hero";
import PromptField from "./_components/prompt-field";

function LandingPage() {
  return (
    <div className="h-100 w-100" style={{ position: "relative" }}>
      <Heading />
      <PromptField />
      <Hero chars="runp" />
    </div>
  );
}

export default LandingPage;
