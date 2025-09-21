"use client";

import React from "react";
import styled from "styled-components";

import { Badge, Dialog, Table, Tooltip } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";
import {
  CopyCode,
  // UpdateCredentialDialog,
  DeleteCredentialDialog,
} from "@/components";

import { format, formatDistanceToNow } from "date-fns";
import { maskKey } from "@/utils/data-tables";

import type { ThirdPartyServiceType } from "generated/prisma";

const StyledTable = styled(Table)`
  background-color: var(--contrast-color);
`;

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
      service: ThirdPartyServiceType;
    }[];
  }[];
}) {
  return (
    <StyledTable className="w-100">
      <Table.Body>
        {data.map((credential) => {
          const createdAt = format(credential.createdAt, "dd/MM/yyyy");
          const lastUpdate = formatDistanceToNow(credential.updatedAt, {
            addSuffix: true,
          });

          return (
            <Table.Row key={credential.id}>
              <Table.Cell>
                <span className="flex  align-center g-medium-10">
                  <p className="fs-medium-10">{credential.name}</p>
                  <span className="opacity-default-10">/</span>

                  {credential.integrations.map((integration, index) => (
                    <React.Fragment key={index}>
                      <Badge variant="border">
                        <kbd className="fs-small-60">{integration.service}</kbd>
                      </Badge>
                      {integration.isPrimary ? (
                        <Tooltip content="Active">
                          <Badge variant="success">
                            <Icon
                              fill="var(--color-green)"
                              width={12}
                              height={12}
                            >
                              <PixelIcon.CheckDouble />
                            </Icon>
                          </Badge>
                        </Tooltip>
                      ) : (
                        <Tooltip content="Inactive">
                          <Badge variant="border">
                            <Icon width={12} height={12}>
                              <PixelIcon.EyeClosed />
                            </Icon>
                          </Badge>
                        </Tooltip>
                      )}
                    </React.Fragment>
                  ))}
                </span>
              </Table.Cell>

              <Table.Cell>
                <span className="flex align-center g-medium-10">
                  <Badge variant="border">
                    <kbd className="fs-small-60">
                      {maskKey(credential.value)}
                    </kbd>
                  </Badge>
                  <CopyCode value={credential.value} />
                </span>
              </Table.Cell>

              <Table.Cell>
                <span className="flex  g-medium-10 align-center">
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
                </span>
              </Table.Cell>

              <Table.Cell className="flex justify-end">
                {/* <Dialog.Root>
                  <Dialog.Trigger variant="border" sizing="small" rawicon>
                    <span className="flex align-center justify-center p-y-small-60">
                      <Icon>
                        <PixelIcon.EditBox />
                      </Icon>
                    </span>
                  </Dialog.Trigger>

                  <UpdateCredentialDialog credentialId={credential.id} />
                </Dialog.Root> */}
                <Dialog.Root>
                  <Dialog.Trigger variant="border" sizing="small" rawicon>
                    <span className="flex align-center justify-center p-y-small-60">
                      <Icon>
                        <PixelIcon.Close />
                      </Icon>
                    </span>
                  </Dialog.Trigger>

                  <DeleteCredentialDialog credentialName={credential.name} />
                </Dialog.Root>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </StyledTable>
  );
}

export default CredentialsTable;
