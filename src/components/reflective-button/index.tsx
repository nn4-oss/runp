"use client";

import React from "react";
import styled from "styled-components";

import { Button } from "@usefui/components";

interface ReflectiveButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
}

interface OverlayProps {
  $isHovering: boolean;
}

interface MaskProps {
  $mouseX: number;
  $mouseY: number;
}

const StyledButton = styled(Button)`
  position: relative;
  border-radius: var(--measurement-medium-30) !important;

  svg {
    transition: all 0.2s ease-in-out;
  }
  &:hover {
    /* Group hover styles can be added here if needed */
  }
`;

const Overlay = styled.div<OverlayProps>`
  position: absolute;
  inset: -1px;
  border-radius: var(--measurement-medium-30);
  pointer-events: none;
  opacity: ${(props) => (props.$isHovering ? 1 : 0)};
  background: transparent;
  transition: opacity 0.2s ease-in-out;
`;

const MaskElement = styled.div<MaskProps>`
  position: absolute;
  inset: 0;
  border-radius: var(--measurement-medium-30);
  background: transparent;
  border: var(--measurement-small-30) solid var(--font-color-alpha-20);
  clip-path: inset(0 round var(--measurement-medium-30));

  mask-image: radial-gradient(
    circle at ${(props) => props.$mouseX}% ${(props) => props.$mouseY}%,
    var(--body-color),
    transparent 100%
  );
  -webkit-mask-image: radial-gradient(
    circle at ${(props) => props.$mouseX}% ${(props) => props.$mouseY}%,
    var(--body-color),
    transparent 100%
  );
`;

function ReflectiveButton({ children, ...props }: ReflectiveButtonProps) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setPosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [],
  );

  return (
    <StyledButton
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      <Overlay $isHovering={isHovering}>
        <MaskElement $mouseX={position.x} $mouseY={position.y} />
      </Overlay>
      {children}
    </StyledButton>
  );
}

export default ReflectiveButton;
