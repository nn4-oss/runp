"use client";

import React from "react";
import { Badge, Table } from "@usefui/components";

import { format, formatDistanceToNow } from "date-fns";
import { Icon, PixelIcon } from "@usefui/icons";

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
    integrations: {
      isPrimary: boolean;
    }[];
  }[];
}) {
  return (
    <Table className="w-100">
      <Table.Body>
        {data.map((credential) => {
          const isUsedAsPrimary = credential.integrations.some(
            (integration) => integration.isPrimary,
          );

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
                {isUsedAsPrimary && (
                  <Badge variant="success">
                    <Icon fill="var(--color-green)">
                      <PixelIcon.Check />
                    </Icon>
                    Active
                  </Badge>
                )}
                {!isUsedAsPrimary && (
                  <Badge variant="secondary">
                    <Icon fill="var(--font-color)">
                      <PixelIcon.Lock />
                    </Icon>
                    Inactive
                  </Badge>
                )}
              </Table.Cell>
              <Table.Cell>
                <p className="fs-medium-10 opacity-default-60">
                  {credential.integrations.length}&nbsp;integration(s)
                </p>
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
