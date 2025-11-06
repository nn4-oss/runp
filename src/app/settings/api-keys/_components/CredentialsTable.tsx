"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

import { Badge, Dialog, Tooltip, Card } from "@usefui/components";
import { Icon } from "@usefui/icons";
import { DeleteCredentialDialog, SplitText } from "@/components";

import { format } from "date-fns";
import { maskKey } from "@/utils/data-tables";

import type { ThirdPartyServiceType } from "generated/prisma";

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
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <Card.Grid sizing="large">
        {data.map((credential) => {
          const createdAt = format(credential.createdAt, "dd/MM/yyyy");

          return (
            <motion.div key={credential.id} variants={slide}>
              <Card key={credential.id}>
                <Card.Body>
                  <header className="flex align-center justify-between m-b-large-30">
                    <kbd className="fs-small-60 opacity-default-30">
                      <SplitText
                        stagger={0.02}
                        duration={0.1}
                        variant="fade"
                        text={maskKey(credential.id)}
                      />
                    </kbd>

                    <div className="flex align-center g-medium-10">
                      <Dialog.Root>
                        <Dialog.Trigger
                          variant="tertiary"
                          animation="reflective"
                          sizing="small"
                          rawicon
                        >
                          <span className="flex align-center justify-center p-y-small-60">
                            <Icon>
                              <Icon.Trash />
                            </Icon>
                          </span>
                        </Dialog.Trigger>
                        <DeleteCredentialDialog
                          credentialName={credential.name}
                        />
                      </Dialog.Root>
                    </div>
                  </header>
                  <div className="flex justify-between align-end g-medium-30 w-100">
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
                                <Icon width={12} height={12}>
                                  <Icon.LinkSkew />
                                </Icon>
                              </Badge>
                            </Tooltip>
                          ) : (
                            <Tooltip content="Inactive">
                              <Badge variant="border">
                                <Icon width={12} height={12}>
                                  <Icon.LinkOff />
                                </Icon>
                              </Badge>
                            </Tooltip>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          );
        })}
      </Card.Grid>
    </motion.div>
  );
}

export default CredentialsTable;
