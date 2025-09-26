"use client";
import React from "react";
import styled from "styled-components";

import { motion, type Variant, type Variants } from "framer-motion";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  variant?:
    | "fade"
    | "slideUp"
    | "scale"
    | "slideDown"
    | "slideLeft"
    | "slideRight";
  stagger?: number;
  once?: boolean;
}

const CharacterWrapper = styled(motion.span)`
  display: inline-block;
  white-space: pre;
`;

// const WordWrapper = styled(motion.span)`
//   display: inline-block;
//   white-space: pre;
// `;

const variants: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
};

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 0,
  duration = 0.5,
  variant = "slideUp",
  stagger = 0.03,
  once = true,
}) => {
  const characters = text.split("");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: variants[variant]?.hidden as Variant,
    visible: {
      ...variants[variant]?.visible,
      transition: {
        duration,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once }}
    >
      {characters.map((char, index) => (
        <CharacterWrapper key={index} variants={itemVariants}>
          {char}
        </CharacterWrapper>
      ))}
    </motion.span>
  );
};

// interface SplitWordsProps extends Omit<SplitTextProps, "stagger"> {
//   stagger?: number;
// }

// export const SplitWords: React.FC<SplitWordsProps> = ({
//   text,
//   className = "",
//   delay = 0,
//   duration = 0.5,
//   variant = "slideUp",
//   stagger = 0.1,
//   once = true,
// }) => {
//   const words = text.split(" ");

//   const containerVariants = {
//     hidden: {},
//     visible: {
//       transition: {
//         staggerChildren: stagger,
//         delayChildren: delay,
//       },
//     },
//   };

//   const itemVariants: Variants = {
//     hidden: variants[variant]?.hidden as Variant,
//     visible: {
//       ...variants[variant]?.visible,
//       transition: {
//         duration,
//         ease: [0.4, 0, 0.2, 1] as const,
//       },
//     },
//   };

//   return (
//     <motion.span
//       className={className}
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       viewport={{ once }}
//     >
//       {words.map((word, index) => (
//         <WordWrapper key={index} variants={itemVariants}>
//           {word}
//           {index < words.length - 1 ? " " : ""}
//         </WordWrapper>
//       ))}
//     </motion.span>
//   );
// };

export default SplitText;
