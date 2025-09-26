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
  font-size: clamp(var(--fontsize-large-30), 5vw, var(--fontsize-large-60));
  font-weight: 500 !important;
  letter-spacing: calc((1.1618px * 2) * -1);
  position: relative;
`;
const AnimatedSubtitle = styled(motion.p)<{
  variants: Variants;
}>`
  font-size: clamp(var(--fontsize-medium-10), 5vw, var(--fontsize-medium-30));
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};
const titleVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

const subtitleVariants = {
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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatedTitle variants={titleVariants}>
        <SplitText
          stagger={0.02}
          duration={0.1}
          variant="fade"
          text="Ideas to features in seconds"
        />
      </AnimatedTitle>
      <AnimatedSubtitle variants={subtitleVariants}>
        <SplitText
          stagger={0.02}
          duration={0.1}
          variant="fade"
          text="Start building with with prompts."
        />
      </AnimatedSubtitle>
    </HeadingGroup>
  );
}

export default HomeHeading;
