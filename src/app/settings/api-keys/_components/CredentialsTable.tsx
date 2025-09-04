"use client";

import React from "react";
import { Table } from "@usefui/components";

import { format, formatDistanceToNow } from "date-fns";

function CredentialsTable({
  data,
}: {
  data: {
    name: string;
    value: string;
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}) {
  return (
    <Table className="w-100">
      <Table.Body>
        {data.map((credential) => {
          const createdAt = format(credential.createdAt, "dd/MM/yyyy");
          const lastUpdate = formatDistanceToNow(credential.updatedAt, {
            addSuffix: true,
          });

          return (
            <Table.Row key={credential.id}>
              <Table.Cell>
                <p className="fs-medium-10">{credential.name}</p>
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
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}

export default CredentialsTable;
