"use client";

import React from "react";
import styled from "styled-components";

import { motion, type Variants } from "framer-motion";

import { useRouter } from "next/navigation";

import { Dialog, DropdownMenu, Card } from "@usefui/components";
import { Icon, PixelIcon, WebIcon } from "@usefui/icons";

import { DeleteProjectDialog, SplitText, UpdateNameDialog } from "@/components";

import { maskKey } from "@/utils/data-tables";
import { format, formatDistanceToNow } from "date-fns";

import type { MessageRole, MessageType } from "generated/prisma";
import Link from "next/link";

const CardLink = styled(Link)`
  text-decoration: none;

  &:hover {
    span {
      opacity: 1;
    }
  }
`;

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};
const slide: Variants = {
  hidden: {
    opacity: 0,
    y: -3,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

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
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <Card.Grid sizing="large">
        {data.map((project) => {
          const createdAt = format(project.createdAt, "dd/MM/yyyy");
          const lastUpdate = formatDistanceToNow(project.updatedAt, {
            addSuffix: true,
          });

          return (
            <motion.div key={project.id} variants={slide}>
              <Card>
                <Card.Body>
                  <header className="flex align-center justify-between m-b-large-30">
                    <kbd className="fs-small-60 opacity-default-30">
                      <SplitText
                        stagger={0.02}
                        duration={0.1}
                        variant="fade"
                        text={maskKey(project.id)}
                      />
                    </kbd>

                    <div className="flex align-center g-small-30">
                      <Dialog.Root>
                        <DropdownMenu.Root>
                          <DropdownMenu>
                            <DropdownMenu.Trigger
                              variant="tertiary"
                              sizing="small"
                              animation="reflective"
                            >
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
                                  await navigator.clipboard.writeText(
                                    project.id,
                                  );
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
                        <Dialog.Trigger
                          variant="tertiary"
                          animation="reflective"
                          sizing="small"
                          rawicon
                        >
                          <span className="flex align-center justify-center p-y-small-60">
                            <Icon>
                              <PixelIcon.Close />
                            </Icon>
                          </span>
                        </Dialog.Trigger>
                        <DeleteProjectDialog projectId={project.id} />
                      </Dialog.Root>
                    </div>
                  </header>
                  <div className="flex justify-between g-medium-30 align-end w-100">
                    <div>
                      <p className="fs-medium-20">
                        <SplitText
                          stagger={0.02}
                          duration={0.01}
                          variant="fade"
                          text={project.name}
                        />
                      </p>
                      <p className="fs-medium-10 opacity-default-30">
                        Created&nbsp;{createdAt}
                      </p>
                    </div>
                  </div>
                </Card.Body>
                <Card.Meta>
                  <CardLink
                    href={`/projects/${project.id}`}
                    className="p-medium-30 flex align-center justify-between w-100"
                  >
                    <span className="flex align-center g-medium-10 fs-medium-10 opacity-default-60">
                      <Icon fillOpacity={0.3}>
                        <PixelIcon.Clock />
                      </Icon>
                      Updated&nbsp;{lastUpdate}
                    </span>
                    <Icon>
                      <PixelIcon.CornerUpRight />
                    </Icon>
                  </CardLink>
                </Card.Meta>
              </Card>
            </motion.div>
          );
        })}
      </Card.Grid>
    </motion.div>
  );
}

export default ProjectsTable;
