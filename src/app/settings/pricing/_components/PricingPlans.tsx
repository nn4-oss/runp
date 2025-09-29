"use client";

import React from "react";
import styled from "styled-components";

import { motion, type Variants } from "framer-motion";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button, Dialog, Divider } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";
import { BorderWrapper } from "../../(general)/_components/GeneralSettings";
import { SendMessageDialog } from "@/components";

import { toast } from "sonner";
import { ScopeEnum } from "generated/prisma";
import { SCOPES_FEATURES } from "@/utils/scope-features";

const PlansGrid = styled(motion.div)<{ variants?: Variants }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  grid-gap: var(--measurement-medium-30) var(--measurement-medium-30);
  box-sizing: border-box;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
`;
const AnimatedWrapper = styled(motion(BorderWrapper))<{
  variants?: Variants;
}>``;

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

function PricingPlans() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: user } = useQuery(trpc.user.get.queryOptions());
  const updateUser = useMutation(
    trpc.user.update.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(trpc.user.get.queryOptions());
        await queryClient.invalidateQueries(trpc.usage.status.queryOptions());
        await queryClient.invalidateQueries(
          trpc.usage.getMetadata.queryOptions(),
        );

        toast.success(`Thank you for using Runp ${data.scope}!`, {
          id: "upgrade-scope",
        });
      },

      onError: (error) => toast.error(error.message),
    }),
  );
  const isFreeScope = user?.scope === ScopeEnum.FREE;

  const onSubmit = React.useCallback(
    async (selectedScope: ScopeEnum) => {
      await updateUser.mutateAsync({
        scope: selectedScope,
      });
    },
    [updateUser],
  );

  return (
    <PlansGrid variants={stagger} initial="hidden" animate="visible">
      <AnimatedWrapper className="p-medium-60" variants={slide}>
        <hgroup className="grid g-medium-30">
          <h6 className="fs-medium-40">Runp&nbsp;Free</h6>
          <span className="fs-medium-20 flex align-center">
            Free&nbsp;
            <span className="opacity-default-30 fs-medium-10">/month</span>
          </span>
        </hgroup>
        <Divider className="m-y-large-10" />
        <div className="grid g-medium-60">
          {SCOPES_FEATURES.FREE.map((feat, key) => (
            <div key={key} className="flex align-center g-medium-30">
              <Icon>
                <PixelIcon.Check />
              </Icon>
              <p className="fs-medium-20">{feat}</p>
            </div>
          ))}
        </div>
        <Divider className="m-y-large-10" />

        <Button
          sizing="large"
          variant="border"
          className="w-100"
          disabled={isFreeScope || updateUser.isPending}
          onClick={() => onSubmit(ScopeEnum.FREE)}
        >
          {isFreeScope ? "Current plan" : "Start building for free"}
        </Button>
      </AnimatedWrapper>
      <AnimatedWrapper className="p-medium-60" variants={slide}>
        <hgroup className="grid g-medium-30">
          <h6 className="fs-medium-40">Runp&nbsp;Pro</h6>

          <span className="fs-medium-20 flex align-center">
            Free&nbsp;
            <span className="opacity-default-30 fs-medium-10">/month</span>
          </span>
        </hgroup>
        <Divider className="m-y-large-10" />

        <div className="grid g-medium-60">
          {SCOPES_FEATURES.PRO.map((feat, key) => (
            <div key={key} className="flex align-center g-medium-30">
              <Icon>
                <PixelIcon.Check />
              </Icon>
              <p className="fs-medium-20">{feat}</p>
            </div>
          ))}
        </div>
        <Divider className="m-y-large-10" />
        <Button
          sizing="large"
          variant="border"
          className="w-100"
          disabled={user?.scope === ScopeEnum.PRO || updateUser.isPending}
          onClick={() => onSubmit(ScopeEnum.PRO)}
        >
          {user?.scope === ScopeEnum.PRO
            ? "Current plan"
            : "Upgrade to runp PRO"}
        </Button>
      </AnimatedWrapper>
      <AnimatedWrapper className="p-medium-60" variants={slide}>
        <hgroup className="grid g-medium-30">
          <h6 className="fs-medium-40">Runp&nbsp;Enterprise</h6>
          <span className="fs-medium-20 flex align-center">Let's talk</span>
        </hgroup>
        <Divider className="m-y-large-10" />

        <div className="grid g-medium-60">
          {SCOPES_FEATURES.ENTERPRISE.map((feat, key) => (
            <div key={key} className="flex align-center g-medium-30">
              <Icon>
                <PixelIcon.Check />
              </Icon>
              <p className="fs-medium-20">{feat}</p>
            </div>
          ))}
        </div>
        <Divider className="m-y-large-10" />
        <Dialog.Root>
          <Dialog.Trigger sizing="large" variant="primary" className="w-100">
            Contact
          </Dialog.Trigger>
          <SendMessageDialog />
        </Dialog.Root>
      </AnimatedWrapper>
    </PlansGrid>
  );
}

export default PricingPlans;
