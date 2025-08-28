"use client";

import React from "react";
import styled from "styled-components";

import { TextLimiter } from "@/components/breadcrumbs";
import { Accordion, Divider } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

import { getFilesKeys } from "../../_utils";

import type { FilesProps, FragmentBubbleProps } from "../../_types";

const WrappedAccordion = styled(Accordion)`
  display: block;
  width: fit-content;
  min-width: var(--measurement-large-90);
  padding: var(--measurement-medium-50);

  background: var(--contrast-color);
  border: var(--measurement-small-30) solid var(--font-color-alpha-10);
  border-radius: var(--measurement-medium-30);
`;

function FragmentBubble({ fragment, isActiveFragment }: FragmentBubbleProps) {
  const [scroll, setScroll] = React.useState<number>(0);

  const lastFileRef = React.useRef<HTMLDivElement>(null);
  const filesKeys = getFilesKeys(fragment?.files as FilesProps | null);

  React.useEffect(() => {
    lastFileRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [scroll]);

  console.log(fragment);

  return (
    <Accordion.Root>
      <WrappedAccordion data-active={String(isActiveFragment)}>
        <Accordion.Trigger
          value={String(fragment?.id)}
          variant="ghost"
          sizing="small"
          onClick={() => isActiveFragment && setScroll(scroll + 1)}
        >
          <Icon>
            <PixelIcon.ChevronDown />
          </Icon>
          {fragment?.title}
        </Accordion.Trigger>
        <Accordion.Content
          className="grid g-medium-60"
          value={String(fragment?.id)}
        >
          <Divider className="m-t-medium-60" />
          {filesKeys.map((fileKey) => {
            const name = fileKey.split("/").at(-1);

            return (
              <TextLimiter
                key={fileKey}
                className="flex align-center g-medium-10"
              >
                <Icon opacity={0.3}>
                  <PixelIcon.File />
                </Icon>
                <span className="fs-medium-10">{name}</span>
                <span className="fs-medium-10 opacity-default-60">
                  {fileKey}
                </span>
              </TextLimiter>
            );
          })}
        </Accordion.Content>
      </WrappedAccordion>

      <div ref={lastFileRef} />
    </Accordion.Root>
  );
}

export default FragmentBubble;
