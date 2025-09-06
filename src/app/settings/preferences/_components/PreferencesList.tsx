"use client";

import React from "react";

import { FixedHeader } from "@/components";
import { Button } from "@usefui/components";

function PreferencesList() {
  return (
    <section className="w-100 h-100">
      <FixedHeader className="grid">
        <div className="flex justify-between align-center p-y-medium-60 p-x-medium-60">
          <p className="fs-medium-20">Preferences</p>

          <Button variant="border" sizing="medium">
            Placeholder
          </Button>
        </div>
      </FixedHeader>

      <div className="p-medium-30 grid w-100 ">
        {/* {hasData && <CredentialsTable data={credentials} />} */}
      </div>
    </section>
  );
}

export default PreferencesList;
