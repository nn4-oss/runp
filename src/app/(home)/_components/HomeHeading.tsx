"use client";

import React from "react";
import styled from "styled-components";

import { motion, type Variants } from "framer-motion";
import { SplitText } from "@/components";

const HeadingGroup = styled(motion.hgroup)<{
  variants: Variants;
}>`
  text-align: center;
  z-index: 100;
`;
const AnimatedTitle = styled(motion.h1)<{
  variants: Variants;
}>`
  font-size: clamp(var(--fontsize-large-10), 5vw, var(--fontsize-large-20));
  font-weight: 400 !important;
  letter-spacing: calc((1.1618px * 2) * -1);
  position: relative;
`;
const AnimatedSubtitle = styled(motion.p)<{
  variants: Variants;
}>`
  font-size: clamp(var(--fontsize-medium-10), 5vw, var(--fontsize-medium-30));
`;

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};
const fade: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};
const slide: Variants = {
  hidden: {
    opacity: 0,
    y: -3,
  },
  visible: {
    opacity: 0.3,
    y: 0,
  },
};

function HomeHeading() {
  return (
    <HeadingGroup
      className="grid align-center justify-center m-b-medium-60"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <AnimatedTitle variants={fade}>
        <SplitText
          stagger={0.02}
          duration={0.1}
          variant="fade"
          text="Prompt. Preview. Ship."
        />
      </AnimatedTitle>
      <AnimatedSubtitle variants={slide}>
        <SplitText
          stagger={0.02}
          duration={0.1}
          variant="fade"
          text="Build features at the speed of thought"
        />
      </AnimatedSubtitle>
    </HeadingGroup>
  );
}

export default HomeHeading;
