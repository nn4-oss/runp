"use client";

import React from "react";
import styled from "styled-components";

import {
  Badge,
  Dialog,
  DropdownMenu,
  Table,
  Tooltip,
} from "@usefui/components";
import { Icon, PixelIcon, WebIcon } from "@usefui/icons";
import {
  Card,
  CopyCode,
  // UpdateCredentialDialog,
  DeleteCredentialDialog,
  DeleteProjectDialog,
  UpdateNameDialog,
} from "@/components";

import { format, formatDistanceToNow } from "date-fns";
import { maskKey } from "@/utils/data-tables";

import type { ThirdPartyServiceType } from "generated/prisma";
import router from "next/router";

const StyledTable = styled(Table)`
  background-color: var(--contrast-color);
`;

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
    <GridLayout>
      {data.map((credential) => {
        const createdAt = format(credential.createdAt, "dd/MM/yyyy");
        const lastUpdate = formatDistanceToNow(credential.updatedAt, {
          addSuffix: true,
        });

        return (
          <Card
            key={credential.id}
            updatedAt={lastUpdate}
            itemId={credential.id}
          >
            <header className="flex align-center justify-between m-b-large-30">
              <kbd className="fs-small-60 opacity-default-30">
                {maskKey(credential.id)}
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
                  <DeleteCredentialDialog credentialName={credential.name} />
                </Dialog.Root>
              </div>
            </header>
            <div className="flex justify-between align-end w-100">
              <div className="w-100">
                <p className="fs-medium-20">{credential.name}</p>
                <p className="fs-medium-10 opacity-default-30">
                  Created&nbsp;{createdAt}
                </p>
              </div>

              <div className="flex align-center g-medium-30 justify-end">
                {credential.integrations.map((integration, index) => (
                  <React.Fragment key={index}>
                    <kbd className="fs-small-60 opacity-default-60">
                      {integration.service}
                    </kbd>

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
              </div>
            </div>
          </Card>
        );
      })}
    </GridLayout>
  );
}

export default CredentialsTable;
