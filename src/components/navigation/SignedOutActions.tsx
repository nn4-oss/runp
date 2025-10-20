"use client";

import React from "react";

import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@usefui/components";

function SignedOutActions() {
  return (
    <SignedOut>
      <SignInButton>
        <Button variant="mono" sizing="medium" animation="reflective">
          Sign&nbsp;In
        </Button>
      </SignInButton>
      <SignUpButton>
        <Button variant="border" sizing="medium" animation="reflective">
          Sign&nbsp;Up
        </Button>
      </SignUpButton>
    </SignedOut>
  );
}

export default SignedOutActions;
