"use client";

import React from "react";
import { Spinner } from "@/components";

function loading() {
  return (
    <section className="flex h-100 align-center justify-center">
      <Spinner />
    </section>
  );
}

export default loading;
