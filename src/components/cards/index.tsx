"use client";

import { Button } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  width: 100%;
  background-color: var(--font-color-alpha-10);
  border-radius: var(--measurement-medium-30);
`;
const CardWrapper = styled.div`
  background-color: var(--contrast-color);
  border: var(--measurement-small-30) solid var(--font-color-alpha-10);
  border-radius: var(--measurement-medium-30);
`;

function Card({
  itemId,
  updatedAt,
  children,
}: {
  itemId: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <CardContainer>
      <CardWrapper className="p-medium-60 w-100">{children}</CardWrapper>
      <footer className="p-medium-30 flex align-center justify-between w-100">
        <Button
          variant="ghost"
          sizing="small"
          className="w-100 justify-between"
          onMouseDown={() => router.push(`/projects/${itemId}`)}
        >
          <span className="flex align-center g-medium-10">
            <Icon fillOpacity={0.3}>
              <PixelIcon.Clock />
            </Icon>
            Updated&nbsp;{updatedAt}
          </span>

          <Icon>
            <PixelIcon.ArrowRight />
          </Icon>
        </Button>
      </footer>
    </CardContainer>
  );
}

export default Card;
