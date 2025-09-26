"use client";

import React from "react";
import styled from "styled-components";

import { motion, type Variants } from "framer-motion";

import { useRouter } from "next/navigation";

import { Badge, Dialog, DropdownMenu } from "@usefui/components";
import { Icon, PixelIcon, WebIcon } from "@usefui/icons";
import {
  Card,
  CardsGrid,
  DeleteProjectDialog,
  SplitText,
  UpdateNameDialog,
} from "@/components";

import { maskKey } from "@/utils/data-tables";
import { format, formatDistanceToNow } from "date-fns";

import type { MessageRole, MessageType } from "generated/prisma";

const AnimatedContainer = styled(motion(CardsGrid))<{ variants?: Variants }>``;

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
    <AnimatedContainer variants={stagger} initial="hidden" animate="visible">
      {data.map((project) => {
        const createdAt = format(project.createdAt, "dd/MM/yyyy");
        const lastUpdate = formatDistanceToNow(project.updatedAt, {
          addSuffix: true,
        });

        return (
          <motion.div key={project.id} variants={slide}>
            <Card
              footer={
                <footer className="p-medium-30 flex align-center justify-between w-100">
                  <span className="flex align-center g-medium-10 fs-medium-10 opacity-default-60">
                    <Icon fillOpacity={0.3}>
                      <PixelIcon.Clock />
                    </Icon>
                    Updated&nbsp;{lastUpdate}
                  </span>
                  {/* <Button
                    variant="ghost"
                    onMouseDown={() => router.push(`/projects/${project.id}`)}
                  >
                    <Icon>
                      <PixelIcon.ArrowRight />
                    </Icon>
                  </Button> */}
                </footer>
              }
            >
              <header className="flex align-center justify-between m-b-large-30">
                <kbd className="fs-small-60 opacity-default-30">
                  <SplitText
                    stagger={0.02}
                    duration={0.1}
                    variant="fade"
                    text={maskKey(project.id)}
                  />
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
                  <span className="fs-medium-10 opacity-default-10">/</span>
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

                <Badge variant="border">
                  {project.messages.length}&nbsp;Messages
                </Badge>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </AnimatedContainer>
  );
}

export default ProjectsTable;
