"use client";

import React from "react";
import styled from "styled-components";

import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

import {
  Button,
  DropdownMenu,
  Field,
  Switch,
  Tooltip,
} from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

const PromptWrapper = styled.div`
  border: var(--measurement-small-30) solid var(--font-color-alpha-10);

  border-radius: var(--measurement-medium-60);
  max-width: var(--breakpoint-tablet);
  margin: var(--measurement-large-10) auto;

  background: var(--contrast-color);

  box-shadow: 0 var(--measurement-medium-30) var(--measurement-medium-60)
    calc(var(--measurement-medium-30) * -1) var(--contrast-color);
`;

function PromptField() {
  const [value, setValue] = React.useState<string>("");

  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: () => console.log("Background job started"),
      onError: () => console.error("Background job error"),
    }),
  );

  return (
    <PromptWrapper className="p-medium-60 w-100">
      <Field.Root>
        <Field
          autoComplete="off"
          name="prompt-field"
          placeholder="Ask Runp to build..."
          className="w-100"
          sizing="large"
          variant="ghost"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          style={{ paddingBottom: 48, width: "100%" }}
        />
      </Field.Root>

      <div className="flex align-center justify-between">
        <div className="flex align-center g-medium-60">
          <Tooltip content="Attach file">
            <Button variant="ghost">
              <Icon>
                <PixelIcon.Plus />
              </Icon>
            </Button>
          </Tooltip>

          <DropdownMenu.Root>
            <Tooltip content="Prompt Tools">
              <DropdownMenu.Trigger variant="ghost">
                <Icon>
                  <PixelIcon.Sliders />
                </Icon>
              </DropdownMenu.Trigger>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenu.Content>
                <DropdownMenu.Item radio>
                  <Field.Label
                    optional
                    className="flex align-center justify-between w-100 g-medium-30"
                    htmlFor="enable-graphs"
                  >
                    <span className="flex align-center g-medium-30 fs-medium-20">
                      <Icon>
                        <PixelIcon.Zap />
                      </Icon>
                      Enable Graphs
                    </span>

                    <Switch.Root>
                      <Switch
                        name="enable-graphs"
                        sizing="medium"
                        defaultChecked
                      >
                        <Switch.Thumb />
                      </Switch>
                    </Switch.Root>
                  </Field.Label>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  radio
                  disabled
                  className="flex align-center g-medium-30 "
                >
                  <Icon>
                    <PixelIcon.Script />
                  </Icon>
                  <span className="fs-medium-20">Enhance Prompt</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </DropdownMenu.Root>
        </div>

        <div className="flex align-center g-medium-60">
          <Button
            variant="primary"
            sizing="small"
            onClick={() => invoke.mutate({ value })}
            disabled={invoke.isPending}
            type="button"
          >
            <span className="p-y-small-30">
              <Icon>
                <PixelIcon.ArrowRight />
              </Icon>
            </span>
          </Button>
        </div>
      </div>
    </PromptWrapper>
  );
}

export default PromptField;
