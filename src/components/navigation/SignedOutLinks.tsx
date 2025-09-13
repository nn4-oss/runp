"use client";

import React from "react";

import { SignedOut } from "@clerk/nextjs";
import { Button } from "@usefui/components";

function SignedOutLinks() {
  return (
    <SignedOut>
      <div className="flex align-center g-medium-60">
        {/* <Button variant="ghost" sizing="small">
          Docs
        </Button> */}
        {/* <Button variant="ghost" sizing="small">
          Pricing
        </Button> */}
        {/* <Button variant="ghost" sizing="small">
          FAQ
        </Button> */}
      </div>
    </SignedOut>
  );
}

export default SignedOutLinks;
