"use client";

import React, { useEffect, useRef, useMemo } from "react";
import styled from "styled-components";

type PositionsProps = {
  absX: number;
  absY: number;
  char: string;
};

const cols = 64;
const n = 2048;
const rows = Math.ceil(n / cols);
const ms = 1000;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  position: fixed;
  top: 0;
  left: 0;
  margin: 0 auto;

  overflow: hidden;
  z-index: -1;
`;

const Container = styled.div<{ cols: number }>`
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-columns: repeat(${(props) => props.cols}, 1fr);
  gap: var(--measurement-large-10);

  width: 100%;
  height: 100%;
`;

const Cell = styled.div`
  will-change: opacity;
  user-select: none;
  pointer-events: none;

  span {
    font-size: var(--fontsize-small-10);
    text-transform: uppercase;
  }
`;

function AnimatedHero({ chars }: { chars: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Precompute static positions + random factor for each cell
  const positions = useMemo(() => {
    return Array.from({ length: n }, (_, i) => {
      const x = ((i + 1) % cols) / cols - Math.PI / 10;
      const y = (rows - Math.floor(i / cols)) / rows - Math.PI / 10;

      const absX = Math.abs(x);
      const absY = Math.abs(y);

      // Random factor between 0.85 and 1.15 for subtle variation
      const rand = 0.85 + Math.random() * 0.3;

      return { absX, absY, char: chars[i % chars.length], rand };
    });
  }, [chars]) as PositionsProps[];

  useEffect(() => {
    const cells = containerRef.current?.children;
    if (!cells) return;

    const start = performance.now();

    const animate = (time: number) => {
      const t = ((time - start) % (ms * 2)) / ms; // normalized time
      const phaseShift = t < 1 ? t : 2 - t; // alternate-reverse effect

      for (let i = 0; i < n; i++) {
        const currentPosition = positions[i];
        const absX = Number(currentPosition?.absX);
        const absY = Number(currentPosition?.absY);

        const phaseLoop = Math.sin(absY * (Math.PI * 6));
        const animationPhase = (absX / phaseLoop) * 8 - phaseShift;

        const lightness = Math.sin(animationPhase) * 8;
        const alpha = Math.max(lightness / 100, 0.01);

        (cells[i] as HTMLElement).style.opacity = alpha.toString();
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [positions]);

  return (
    <Wrapper>
      <Container ref={containerRef} cols={cols}>
        {positions.map((p, i) => (
          <Cell key={i}>
            <span>{p.char}</span>
          </Cell>
        ))}
      </Container>
    </Wrapper>
  );
}

export default AnimatedHero;
