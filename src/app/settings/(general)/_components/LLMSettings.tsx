"use client";

import React from "react";
import styled from "styled-components";

import { ReflectiveButton, Textarea } from "@/components";
import { Badge, Checkbox, Divider, DropdownMenu } from "@usefui/components";
import { Icon, SocialIcon } from "@usefui/icons";
import { BorderWrapper } from "./GeneralSettings";

const TextareaLg = styled(Textarea)`
  border: var(--measurement-small-30) solid var(--font-color-alpha-10);
  border-radius: var(--measurement-medium-30);

  background: var(--contrast-color);

  will-change: border-color;
  transition: border-color ease-in-out 0.2s;

  &:focus,
  &:hover {
    border-color: var(--font-color-alpha-20);
  }

  height: var(--measurement-large-60) !important;
  max-height: var(--measurement-large-60) !important;
`;

const MODELS = [
  "gpt-4.1",
  "gpt-4",
  "gpt-4-turbo",
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-3.5-turbo",
];

function LLMSettings({ isFreeScope }: { isFreeScope: boolean }) {
  return (
    <BorderWrapper className="p-medium-60">
      <div className="flex align-center justify-between g-medium-10">
        <hgroup className="w-100 grid g-medium-10">
          <div className="flex g-medium-10 align-center">
            <h6 className="fs-medium-20">ER Diagrams</h6>
            {isFreeScope && (
              <Badge
                variant="warning"
                shape="round"
                className="fs-small-60 p-b-small-10"
              >
                Runp Pro
              </Badge>
            )}
          </div>

          <p className="fs-medium-10 opacity-default-60">
            Automatically generate Entity Relationship Diagrams for your
            features.
          </p>
        </hgroup>

        <Checkbox.Root>
          <Checkbox disabled sizing="medium">
            <Checkbox.Indicator />
          </Checkbox>
        </Checkbox.Root>
      </div>

      <Divider className="m-y-medium-50" />

      <div className="flex align-center justify-between g-medium-60">
        <hgroup className="w-100 grid g-medium-10">
          <div className="flex g-medium-10 align-center">
            <h6 className="fs-medium-20">LLM Model</h6>
            {isFreeScope && (
              <Badge
                variant="warning"
                shape="round"
                className="fs-small-60 p-b-small-10"
              >
                Runp Pro
              </Badge>
            )}
          </div>
          <p className="fs-medium-10 opacity-default-60">
            Define which LLM model is used by Runp.
          </p>
        </hgroup>

        <div className="w-100 flex justify-end align-end">
          <DropdownMenu.Root>
            <DropdownMenu>
              <DropdownMenu.Trigger variant="border" sizing="medium" disabled>
                <span>
                  <Icon>
                    <SocialIcon.OpenAi />
                  </Icon>
                </span>
                gpt-4.1
              </DropdownMenu.Trigger>
              <DropdownMenu.Content sizing="small">
                {MODELS.map((model) => (
                  <DropdownMenu.Item key={model}>{model}</DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu>
          </DropdownMenu.Root>
        </div>
      </div>

      <Divider className="m-y-medium-50" />

      <div className="grid g-medium-60 m-b-medium-60">
        <hgroup className="w-100 grid g-medium-10">
          <div className="flex g-medium-10 align-center">
            <h6 className="fs-medium-20">LLM Instructions</h6>
            {isFreeScope && (
              <Badge
                variant="warning"
                shape="round"
                className="fs-small-60 p-b-small-10"
              >
                Runp Pro
              </Badge>
            )}
          </div>
          <p className="fs-medium-10 opacity-default-60">
            Custom instructions used on top of the current system prompt.
          </p>
        </hgroup>

        <form>
          <TextareaLg
            disabled
            className="p-medium-30"
            placeholder="e.g. Use GSAP for animation. Always include Dark Mode support..."
          />
        </form>
      </div>

      <footer className="w-100 flex justify-end align-center">
        <ReflectiveButton variant="mono" sizing="medium">
          Save
        </ReflectiveButton>
      </footer>
    </BorderWrapper>
  );
}

export default LLMSettings;
