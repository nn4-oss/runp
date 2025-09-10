"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";

import {
  CopyCode,
  DeleteProjectDialog,
  Spinner,
  UpdateNameDialog,
} from "@/components";
import {
  Badge,
  Dialog,
  DropdownMenu,
  Table,
  Tooltip,
} from "@usefui/components";
import { Icon, PixelIcon, WebIcon } from "@usefui/icons";

import { maskKey } from "@/utils/data-tables";
import { format, formatDistanceToNow } from "date-fns";

import type { MessageRole, MessageType } from "generated/prisma";

const LinkCell = styled(Table.Cell)`
  cursor: pointer;
`;

function Cell({
  projectId,
  children,
  className,
}: {
  projectId?: string;
  className?: string;

  children: React.ReactNode;
}) {
  const router = useRouter();

  const onClick = () => {
    if (!projectId) return;
    router.push(`/projects/${projectId}`);
  };

  return (
    <LinkCell className={className} onClick={onClick}>
      {children}
    </LinkCell>
  );
}

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
    <Table className="w-100">
      <Table.Body>
        {data.map((project) => {
          const lastMessage = project.messages.at(-1);
          const isProjectError = lastMessage?.type === "ERROR";
          const isProjectReady = lastMessage?.type === "RESULT";

          const createdAt = format(project.createdAt, "dd/MM/yyyy");
          const lastUpdate = formatDistanceToNow(project.updatedAt, {
            addSuffix: true,
          });

          return (
            <React.Fragment key={project.id}>
              <Table.Row>
                <Cell projectId={project.id}>
                  <p className="fs-medium-10">{project.name}</p>
                  <span className="opacity-default-10">/</span>
                  <Badge variant="border">
                    <kbd className="fs-small-60">
                      {project.messages.length}&nbsp;Messages
                    </kbd>
                  </Badge>
                  {isProjectError && (
                    <Tooltip content="Error">
                      <Badge variant="error">
                        <Icon fill="var(--color-red)">
                          <PixelIcon.Alert />
                        </Icon>
                      </Badge>
                    </Tooltip>
                  )}
                  {isProjectReady && (
                    <Tooltip content="Ready">
                      <Badge variant="success">
                        <Icon fill="var(--color-green)">
                          <PixelIcon.CheckDouble />
                        </Icon>
                      </Badge>
                    </Tooltip>
                  )}
                </Cell>
                <Cell>
                  <span className="flex align-center g-medium-10">
                    <Badge variant="border">
                      <kbd className="fs-small-60">{project.id}</kbd>
                    </Badge>
                    <CopyCode value={project.id} />
                  </span>
                </Cell>

                <Cell projectId={project.id}>
                  <Tooltip content="Created At">
                    <Badge variant="border">
                      <Icon>
                        <PixelIcon.Calendar />
                      </Icon>
                      {createdAt}
                    </Badge>
                  </Tooltip>
                  <Tooltip content="Updated At">
                    <Badge variant="border">
                      <Icon>
                        <PixelIcon.Clock />
                      </Icon>
                      {lastUpdate}
                    </Badge>
                  </Tooltip>
                </Cell>

                <Cell className="flex justify-end">
                  <Dialog.Root>
                    <DropdownMenu.Root>
                      <DropdownMenu>
                        <DropdownMenu.Trigger variant="border" sizing="small">
                          <span className="flex align-center justify-center p-y-small-60">
                            <Icon>
                              <WebIcon.Option />
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
                          <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
                            <Dialog.Trigger
                              rawicon
                              variant="ghost"
                              style={{
                                width: "100%",
                                justifyContent: "start",
                              }}
                            >
                              <Icon>
                                <PixelIcon.EditBox />
                              </Icon>
                              Rename
                            </Dialog.Trigger>
                          </DropdownMenu.Item>
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

                  <Dialog.Root>
                    <Dialog.Trigger variant="border" sizing="small" rawicon>
                      <span className="flex align-center justify-center p-y-small-60">
                        <Icon>
                          <PixelIcon.Close />
                        </Icon>
                      </span>
                    </Dialog.Trigger>
                    <DeleteProjectDialog projectId={project.id} />
                  </Dialog.Root>
                </Cell>
              </Table.Row>
            </React.Fragment>
          );
        })}
      </Table.Body>
    </Table>
  );
}

export default ProjectsTable;
