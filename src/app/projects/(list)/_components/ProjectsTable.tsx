"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";

import { Badge, Dialog, DropdownMenu } from "@usefui/components";
import { Icon, PixelIcon, WebIcon } from "@usefui/icons";
import { Card, DeleteProjectDialog, UpdateNameDialog } from "@/components";

import { maskKey } from "@/utils/data-tables";
import { format, formatDistanceToNow } from "date-fns";

import type { MessageRole, MessageType } from "generated/prisma";

export const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--measurement-large-90), 1fr)
  );
  grid-gap: var(--measurement-medium-30) var(--measurement-medium-30);
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
`;

function ProjectsTable({
  data,
}: {
  data: {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    messages: {
      id: string;
      role: MessageRole;
      content: string;
      projectId: string;
      type: MessageType;
      createdAt: Date;
      updatedAt: Date;
    }[];
  }[];
}) {
  const router = useRouter();

  return (
    <GridLayout>
      {data.map((project) => {
        const createdAt = format(project.createdAt, "dd/MM/yyyy");
        const lastUpdate = formatDistanceToNow(project.updatedAt, {
          addSuffix: true,
        });

        return (
          <Card key={project.id} updatedAt={lastUpdate} itemId={project.id}>
            <header className="flex align-center justify-between m-b-large-30">
              <kbd className="fs-small-60 opacity-default-30">
                {maskKey(project.id)}
              </kbd>

              <div className="flex align-center g-medium-10">
                <Dialog.Root>
                  <Dialog.Trigger variant="ghost" sizing="small" rawicon>
                    <span className="flex align-center justify-center p-y-small-60">
                      <Icon>
                        <PixelIcon.Close />
                      </Icon>
                    </span>
                  </Dialog.Trigger>
                  <DeleteProjectDialog projectId={project.id} />
                </Dialog.Root>
                <Dialog.Root>
                  <DropdownMenu.Root>
                    <DropdownMenu>
                      <DropdownMenu.Trigger variant="ghost" sizing="small">
                        <span className="flex align-center justify-center p-y-small-60">
                          <Icon>
                            <WebIcon.More />
                          </Icon>
                        </span>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          className="w-100 flex align-center g-medium-30"
                          onMouseDown={() => {
                            router.push(`/projects/${project.id}`);
                          }}
                        >
                          <Icon>
                            <PixelIcon.Eye />
                          </Icon>
                          Details
                        </DropdownMenu.Item>
                        <Dialog.Trigger
                          rawicon
                          variant="ghost"
                          style={{
                            width: "100%",
                            justifyContent: "start",
                          }}
                        >
                          <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
                            <Icon>
                              <PixelIcon.EditBox />
                            </Icon>
                            Rename
                          </DropdownMenu.Item>
                        </Dialog.Trigger>
                        <DropdownMenu.Item
                          className="w-100 flex align-center g-medium-30"
                          onClick={async () => {
                            await navigator.clipboard.writeText(project.id);
                          }}
                        >
                          <Icon>
                            <PixelIcon.Duplicate />
                          </Icon>
                          Copy Project ID
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu>
                  </DropdownMenu.Root>

                  <UpdateNameDialog
                    currentName={project.name}
                    projectId={project.id}
                  />
                </Dialog.Root>
              </div>
            </header>
            <div className="flex justify-between align-end w-100">
              <div>
                <p className="fs-medium-20">{project.name}</p>
                <p className="fs-medium-10 opacity-default-30">
                  Created&nbsp;{createdAt}
                </p>
              </div>

              <Badge variant="border">
                {project.messages.length}&nbsp;Messages
              </Badge>
            </div>
          </Card>
        );
      })}
    </GridLayout>
  );
}

export default ProjectsTable;
