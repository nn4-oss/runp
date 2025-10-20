"use client";

import React from "react";
import styled, { keyframes } from "styled-components";

import { Accordion, Button, Divider, Tooltip } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";
import { SplitText } from "@/components";

import { getFilesKeys } from "../../_utils";

import type { FilesProps, FragmentBubbleProps } from "../../_types";

const FadeIn = keyframes`
    from {
        opacity: var(--opacity-default-10);
    }
    to {
        opacity: var(--opacity-default-60);
    }
`;
const FadeInText = styled.span`
  animation: ${FadeIn} linear 1s;
`;
const WrappedAccordion = styled(Accordion)`
  display: block;
  width: 100%;
  max-width: var(--breakpoint-mobile);
  padding: var(--measurement-medium-50);

  background: var(--contrast-color);
  border: var(--measurement-small-30) solid var(--font-color-alpha-10);
  border-radius: var(--measurement-medium-30);

  &[data-active="true"] {
    border-color: var(--font-color-alpha-30);
  }
`;

function FragmentBubble({
  fragment,
  onFragmentClick,
  isActiveFragment,
}: FragmentBubbleProps) {
  const filesKeys = getFilesKeys(fragment?.files as FilesProps | null);
  return (
    <Accordion.Root>
      <WrappedAccordion data-active={String(isActiveFragment)}>
        <div className="flex align-center justify-between">
          <Accordion.Trigger
            value={String(fragment?.id)}
            variant="ghost"
            sizing="small"
            style={{ justifyContent: "start", width: "100%" }}
          >
            <Icon>
              <PixelIcon.ChevronDown />
            </Icon>
            <FadeInText>
              <SplitText
                stagger={0.02}
                duration={0.1}
                variant="fade"
                text={String(fragment?.title)}
              />
            </FadeInText>
          </Accordion.Trigger>

          {!isActiveFragment && (
            <Tooltip
              content="Restore version"
              onClick={() => onFragmentClick(fragment)}
            >
              <Button variant="ghost">
                <Icon>
                  <PixelIcon.CornerUpLeft />
                </Icon>
              </Button>
            </Tooltip>
          )}

          {isActiveFragment && (
            <Icon>
              <PixelIcon.ChevronRight />
            </Icon>
          )}
        </div>

        <Accordion.Content
          className="grid g-medium-60"
          value={String(fragment?.id)}
        >
          <Divider className="m-t-medium-60" />
          {filesKeys.map((fileKey) => {
            const name = fileKey.split("/").at(-1);

            return (
              <div key={fileKey} className="flex align-center g-medium-10">
                <Icon opacity={0.3}>
                  <PixelIcon.File />
                </Icon>
                <p className="fs-medium-10 opacity-default-60">{fileKey}</p>
              </div>
            );
          })}
        </Accordion.Content>
      </WrappedAccordion>
    </Accordion.Root>
  );
}

export default FragmentBubble;
