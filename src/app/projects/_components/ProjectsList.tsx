"use client";

import React from "react";
import styled from "styled-components";

import Link from "next/link";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { AppContainer } from "@/components";
import { Divider } from "@usefui/components";

import { formatDistanceToNow } from "date-fns";

const Container = styled.div`
  max-width: var(--breakpoint-desktop-small);
  margin: 0 auto;
`;
const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--measurement-large-90), 1fr)
  );
  grid-gap: var(--measurement-medium-60) var(--measurement-medium-60);
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
`;
const Card = styled(Link)`
  text-decoration: none;
  border: var(--measurement-small-30) solid var(--font-color-alpha-10);
  border-radius: var(--measurement-medium-30);
  background-color: var(--contrast-color);
  padding: var(--measurement-medium-60);

  min-height: var(--measurement-large-80);
`;

function ProjectsList() {
  const trpc = useTRPC();

  const { data: projects } = useSuspenseQuery(
    trpc.projects.getMany.queryOptions(),
  );

  return (
    <AppContainer className="h-100 w-100 " scrollbar>
      <hgroup className="p-t-medium-60 p-x-medium-60">
        <p className="fs-medium-20">
          All projects&nbsp;
          <span className="opacity-default-30">({projects.length})</span>
        </p>
      </hgroup>
      <Divider className="m-y-medium-60" />
      <Container className="p-medium-60">
        <ListWrapper>
          {projects.map((project) => {
            const lastUpdate = formatDistanceToNow(project.updatedAt, {
              addSuffix: true,
            });

            return (
              <div key={project.id}>
                <Card
                  className="flex align-center justify-center m-b-medium-30"
                  href={`/projects/${project.id}`}
                >
                  <span className="fs-medium-10 opacity-default-30">
                    No screenshot available{}
                  </span>
                </Card>
                <div className="grid">
                  <p className="fs-medium-10">{project.name}</p>
                  <p className="fs-medium-10 opacity-default-30">
                    Updated&nbsp;{lastUpdate}
                  </p>
                </div>
              </div>
            );
          })}
        </ListWrapper>
      </Container>
    </AppContainer>
  );
}

export default ProjectsList;
