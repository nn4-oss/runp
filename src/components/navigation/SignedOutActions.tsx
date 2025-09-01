"use client";

import React from "react";
import ReflectiveButton from "../reflective-button";

import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@usefui/components";

function SignedOutActions() {
  return (
    <SignedOut>
      <span className="opacity-default-10">/</span>

      <SignInButton>
        <ReflectiveButton variant="border" sizing="small">
          Sign&nbsp;In
        </ReflectiveButton>
      </SignInButton>
      <SignUpButton>
        <Button variant="primary" sizing="small">
          Sign&nbsp;Up
        </Button>
      </SignUpButton>
    </SignedOut>
  );
}

export default SignedOutActions;
