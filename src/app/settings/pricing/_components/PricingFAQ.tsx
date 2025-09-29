"use client";

import React from "react";
import styled from "styled-components";

import { motion, type Variants } from "framer-motion";

import { Accordion, Divider } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";
import { BorderWrapper } from "../../(general)/_components/GeneralSettings";

const FAQGrid = styled.div`
  max-width: var(--breakpoint-tablet);
`;
const AnimatedWrapper = styled(motion(BorderWrapper))<{
  variants?: Variants;
}>``;

const FAQ_CONTENT = [
  {
    title: "Why should I use Runp over other apps such as v0?",
    desc: "Runp is a personal side project designed to complement, not compete with, larger platforms. Runp focuses on seamless integration with usefui.dev technologies, helping teams on this stack build features more efficiently with a lightweight alternative to top-tier generative AI apps.",
  },
  {
    title: "Do I have to pay anything to use Runp?",
    desc: " No. Runp is free to use and will remain free. It's a lightweight tool focused on the usefui.dev stack rather than a full-featured alternative to top-tier generative AI apps. If you need the broadest capabilities, those platforms may be a better fit—but if you're working with usefui.dev and want something simple and fast, Runp is a great choice.",
  },
  {
    title: "Do my used credits carry over when I upgrade?",
    desc: "Yes. Credit usage is cumulative across plans. If you use 5 credits on the Free plan and then move to Pro (which includes 100 credits), you'll have 95 credits available after the upgrade.",
  },
  {
    title: "How can I get more usage if I run out of monthly credits?",
    desc: "Runp is free to use and will remain free. If you need additional monthly credits beyond what's included, please contact us to upgrade to the Enterprise plan.",
  },
  {
    title: "If I send a message, where does that usage come from?",
    desc: "Each message consumes your plan's credits. Runp uses tailored system prompts to generate reliable, persistent code for your specific needs and a smooth workflow. If you need to customize the core configuration or prompts, please contact us about upgrading to the Enterprise plan.",
  },
];

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
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

function PricingFAQ() {
  return (
    <AnimatedWrapper
      className="p-medium-60"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <hgroup className="m-b-medium-60">
        <h6 className="fs-medium-20">Frequently Asked Questions</h6>
      </hgroup>

      <Accordion.Root>
        <Accordion className="grid g-medium-60">
          {FAQ_CONTENT.map((item, key) => (
            <React.Fragment key={item.title}>
              <Divider className="m-y-medium-30" />
              <motion.div variants={slide}>
                <Accordion.Trigger
                  value={String(key)}
                  style={{ textAlign: "left" }}
                >
                  <div className="flex g-medium-60 justify-between">
                    <p className="fs-medium-30">{item.title}</p>
                    <span>
                      <Icon>
                        <PixelIcon.ChevronsVertical />
                      </Icon>
                    </span>
                  </div>
                </Accordion.Trigger>
                <Accordion.Content value={String(key)}>
                  <FAQGrid>
                    <p className="fs-medium-20 opacity-default-60 m-t-medium-30">
                      {item.desc}
                    </p>
                  </FAQGrid>
                </Accordion.Content>
              </motion.div>
              {key === FAQ_CONTENT.length - 1 && (
                <Divider className="m-y-medium-30" />
              )}
            </React.Fragment>
          ))}
        </Accordion>
      </Accordion.Root>
    </AnimatedWrapper>
  );
}

export default PricingFAQ;
