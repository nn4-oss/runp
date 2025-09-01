"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";
import { Badge, Table } from "@usefui/components";

import { format, formatDistanceToNow } from "date-fns";

const RowLink = styled(Table.Row)`
  cursor: pointer;
`;

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
            <RowLink
              key={project.id}
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <Table.Cell>
                <Badge variant="border">
                  <span className="flex align-center g-medium-30">
                    <code>{project.id.substring(0, 8)}</code>
                  </span>
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <p className="fs-medium-10">{project.name}</p>
              </Table.Cell>

              <Table.Cell>
                <p className="fs-medium-10 opacity-default-30">
                  Created&nbsp;{createdAt}
                </p>
              </Table.Cell>
              <Table.Cell>
                <p className="fs-medium-10 opacity-default-30">
                  Updated&nbsp;{lastUpdate}
                </p>
              </Table.Cell>
            </RowLink>
          );
        })}
      </Table.Body>
    </Table>
  );
}

export default ProjectsTable;
