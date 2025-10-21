"use client";

import React from "react";
import { Spinner } from "@usefui/components";

function Loading() {
  return (
    <section className="flex h-100 w-100 align-center justify-center">
      <Spinner />
    </section>
  );
}

export default Loading;
