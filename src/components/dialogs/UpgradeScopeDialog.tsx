"use client";

import React from "react";
import styled from "styled-components";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import Link from "next/link";

import { Portal, Dialog, Tabs, Divider, Button } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

import { ScopeEnum } from "generated/prisma";
import { SCOPES_FEATURES } from "@/utils/scope-features";

const PlanTag = styled.b`
  text-transform: capitalize;
`;
const PlansWrapper = styled.div`
  border: var(--measurement-small-30) solid var(--font-color-alpha-10);
  background-color: var(--body-color);
  border-radius: var(--measurement-medium-30);
  padding: var(--measurement-medium-60);
`;

function PlanHeader({ scope }: { scope: string }) {
  return (
    <hgroup className="grid g-medium-30 m-b-medium-60">
      <h6 className="fs-medium-20">Runp&nbsp;{scope}</h6>
      <span className="fs-medium-40 flex align-center">
        $0&nbsp;
        <span className="opacity-default-30 fs-medium-10">/month</span>
      </span>
    </hgroup>
  );
}

function UpgradeScopeDialog() {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.user.get.queryOptions());

  const isFreeScope = user?.scope === ScopeEnum.FREE;

  return (
    <Portal container="portal-container">
      <Dialog sizing="small">
        <hgroup className="m-b-large-10 grid g-medium-30">
          <h6>Explore More Plans</h6>
          <p className="fs-medium-20">
            You are currently using the&nbsp;
            <PlanTag>{user?.scope.toLowerCase() ?? ScopeEnum.FREE}</PlanTag>
            &nbsp;plan.
            {isFreeScope && (
              <span className="opacity-default-60">
                &nbsp;Upgrade for free to unlock Runp at full capacity.
              </span>
            )}
          </p>
        </hgroup>
        <PlansWrapper className="m-b-medium-60">
          <Tabs.Root>
            <Tabs defaultOpen={ScopeEnum.FREE}>
              <div className="flex align-center g-medium-30">
                <Tabs.Trigger sizing="small" value={ScopeEnum.FREE}>
                  Free
                </Tabs.Trigger>
                <span className="opacity-default-10">/</span>
                <Tabs.Trigger sizing="small" value={ScopeEnum.PRO}>
                  Pro
                </Tabs.Trigger>
              </div>

              <Divider className="m-b-medium-60" />
              <Tabs.Content value={ScopeEnum.FREE}>
                <PlanHeader scope="Free" />

                <div className="grid g-medium-30 m-b-large-10">
                  {SCOPES_FEATURES.FREE.map((feat, key) => (
                    <span
                      key={key}
                      className="flex align-center g-medium-30 fs-medium-20"
                    >
                      <Icon>
                        <PixelIcon.Check />
                      </Icon>
                      {feat}
                    </span>
                  ))}
                </div>

                <Button
                  disabled={isFreeScope}
                  sizing="medium"
                  variant={isFreeScope ? "mono" : "primary"}
                  style={{ width: "100%" }}
                >
                  {isFreeScope ? "Current plan" : "Use Runp for Free"}
                </Button>
              </Tabs.Content>

              <Tabs.Content value={ScopeEnum.PRO}>
                <PlanHeader scope="Pro" />
                <div className="grid g-medium-30 m-b-large-10">
                  {SCOPES_FEATURES.PRO.map((feat, key) => (
                    <span
                      key={key}
                      className="flex align-center g-medium-30 fs-medium-20"
                    >
                      <Icon>
                        <PixelIcon.Check />
                      </Icon>
                      {feat}
                    </span>
                  ))}
                </div>

                <Button
                  disabled={!isFreeScope}
                  sizing="medium"
                  variant={isFreeScope ? "primary" : "mono"}
                  style={{ width: "100%" }}
                >
                  {isFreeScope ? "Upgrade to Runp Pro" : "Current plan"}
                </Button>
              </Tabs.Content>
            </Tabs>
          </Tabs.Root>
        </PlansWrapper>
        <footer className="flex align-center justify-start g-medium-10">
          <span className="fs-medium-10 flex align-center g-medium-10 opacity-default-30">
            Compare plans and options on our
            <Link
              href="/pricing"
              target="_blank"
              className="flex align-center g-medium-10"
            >
              pricing page
              <Icon>
                <PixelIcon.Open />
              </Icon>
            </Link>
          </span>
        </footer>
      </Dialog>
      <Dialog.Overlay closeOnInteract />
    </Portal>
  );
}

export default UpgradeScopeDialog;
