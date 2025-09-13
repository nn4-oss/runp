"use client";

import React from "react";
import { useRouter } from "next/navigation";

import {
  Badge,
  Dialog,
  DropdownMenu,
  Table,
  Tooltip,
} from "@usefui/components";
import { Icon, PixelIcon, WebIcon } from "@usefui/icons";
import { CopyCode, DeleteProjectDialog, UpdateNameDialog } from "@/components";

import { maskKey } from "@/utils/data-tables";
import { format, formatDistanceToNow } from "date-fns";
import type { MessageRole, MessageType } from "generated/prisma";

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
          const createdAt = format(project.createdAt, "dd/MM/yyyy");
          const lastUpdate = formatDistanceToNow(project.updatedAt, {
            addSuffix: true,
          });

          return (
            <Table.Row key={project.id}>
              <Table.Cell>
                <p className="fs-medium-10">{project.name}</p>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="border">
                  <kbd className="fs-small-60">
                    {project.messages.length}&nbsp;Messages
                  </kbd>
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <span className="flex align-center g-medium-10">
                  <Badge variant="border">
                    <kbd className="fs-small-60">{maskKey(project.id)}</kbd>
                  </Badge>
                  <CopyCode value={project.id} />
                </span>
              </Table.Cell>

              <Table.Cell>
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
              </Table.Cell>

              <Table.Cell className="flex justify-end">
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
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}

export default ProjectsTable;
