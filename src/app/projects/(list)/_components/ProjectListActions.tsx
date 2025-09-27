"use client";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button, DropdownMenu } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

function ProjectListActions() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("sortBy", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex align-center g-medium-10">
      <Button
        variant="border"
        sizing="medium"
        onMouseDown={() => router.push("/")}
      >
        New
      </Button>
      <DropdownMenu.Root>
        <DropdownMenu>
          <DropdownMenu.Trigger variant="border" sizing="medium">
            Sort by
            <Icon>
              <PixelIcon.Sort />
            </Icon>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              className="flex align-center g-medium-30"
              onClick={() => handSort("asc")}
            >
              <Icon>
                <PixelIcon.ArrowUp />
              </Icon>
              Ascending
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="flex align-center g-medium-30"
              onClick={() => handSort("desc")}
            >
              <Icon>
                <PixelIcon.ArrowDown />
              </Icon>
              Descending
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </DropdownMenu.Root>
    </div>
  );
}

export default ProjectListActions;
