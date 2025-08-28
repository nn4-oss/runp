"use client";

import React from "react";
import styled from "styled-components";

const BreadcrumbItem = styled.span`
  font-size: var(--fontsize-small-60);
`;

export const TextLimiter = styled.div`
  width: 100%;
  max-width: var(--measurement-large-60);

  * {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

interface BreadcrumbsProps {
  capitalizeItems?: boolean;
  path: string;
}

function Breadcrumbs({ path, capitalizeItems = true }: BreadcrumbsProps) {
  if (path === "/") return null;

  const segments = path.split("/").filter(Boolean);

  const items = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = capitalizeItems
      ? segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
      : segment.replace(/-/g, " ");

    const isLastItem = index === segments.length - 1;

    return {
      href,
      label,
      isLastItem,
    };
  });

  return (
    <div className="flex align-center g-medium-30">
      {items.map((item, key) => (
        <React.Fragment key={key}>
          <TextLimiter>
            <BreadcrumbItem
              className={`${!item.isLastItem ? "opacity-default-30" : "opacity-default-60"}`}
            >
              {item.label}
            </BreadcrumbItem>
          </TextLimiter>
          {!item.isLastItem && <span className="opacity-default-10">\</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Breadcrumbs;
