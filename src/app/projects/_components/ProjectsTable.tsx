"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";

import { DeleteProjectDialog, UpdateNameDialog } from "@/components";
import { Badge, Dialog, DropdownMenu, Table } from "@usefui/components";
import { Icon, PixelIcon, WebIcon } from "@usefui/icons";

import { format, formatDistanceToNow } from "date-fns";

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
            <React.Fragment key={project.id}>
              <Table.Row>
                <Cell projectId={project.id}>
                  <Badge variant="border">
                    <span className="flex align-center g-medium-30">
                      <code>{project.id.substring(0, 8)}</code>
                    </span>
                  </Badge>
                </Cell>
                <Cell projectId={project.id}>
                  <p className="fs-medium-10">{project.name}</p>
                </Cell>
                <Cell projectId={project.id}>
                  <p className="fs-medium-10 opacity-default-30">
                    Created&nbsp;{createdAt}
                  </p>
                </Cell>
                <Cell projectId={project.id}>
                  <p className="fs-medium-10 opacity-default-30">
                    Updated&nbsp;{lastUpdate}
                  </p>
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
                            onClick={() => {
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
                        <Icon fill="var(--color-red)">
                          <PixelIcon.Delete />
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
