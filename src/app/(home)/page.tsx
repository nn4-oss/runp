import React from "react";

import LandingHeading from "./_components/LandingHeading";
import PromptField from "./_components/PromptField";
import AnimatedHero from "./_components/AnimatedHero";

async function Page() {
  return (
    <div className="h-100 w-100" style={{ position: "relative" }}>
      <LandingHeading />
      <PromptField />
      <AnimatedHero chars="runp" />
    </div>
  );
}

export default Page;
