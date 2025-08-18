"use client";

import React, { useEffect, useRef, useMemo } from "react";
import styled from "styled-components";

interface Position {
  absX: number;
  absY: number;
  char: string;
}

interface CellState {
  nextChange: number;
  isVisible: boolean;
  opacity: number;
}

const COLS = 24;
const CELLS = 256;
const ROWS = Math.ceil(CELLS / COLS);

const INITIAL_VISIBILITY_CHANCE = 0.01;
const OPACITY_TRANSITION_SPEED = 0.05;

const MIN_CHANGE_DELAY = 1618;
const MAX_CHANGE_DELAY = 1618 * 2;

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
  const totalCells = COLS * ROWS;

  const positions = useMemo((): Position[] => {
    return Array.from({ length: totalCells }, (_, i) => {
      const x = ((i + 1) % COLS) / COLS - Math.PI / 10;
      const y = (ROWS - Math.floor(i / COLS)) / ROWS - Math.PI / 10;

      return {
        absX: Math.abs(x),
        absY: Math.abs(y),
        char: chars[i % chars.length] || "0",
      };
    });
  }, [chars, COLS, ROWS, totalCells]);

  useEffect(() => {
    const cells = containerRef.current?.children;
    if (!cells) return;

    let animationId: number;

    const startTime = performance.now();
    const cellStates: CellState[] = positions.map(() => ({
      nextChange: Math.random() * (Math.PI * 1e4),
      isVisible: Math.random() < INITIAL_VISIBILITY_CHANCE,
      opacity: 0.05,
    }));

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      cellStates.forEach((state, index) => {
        if (elapsed > state.nextChange) {
          state.isVisible = !state.isVisible;
          state.nextChange =
            elapsed +
            MIN_CHANGE_DELAY +
            Math.random() * (MAX_CHANGE_DELAY - MIN_CHANGE_DELAY);
        }

        const targetOpacity = state.isVisible ? 0.1618 : 0.03;

        state.opacity +=
          (targetOpacity - state.opacity) * OPACITY_TRANSITION_SPEED;

        const cellElement = cells[index] as HTMLElement;
        cellElement.style.opacity = state.opacity.toString();
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [positions]);

  return (
    <Wrapper>
      <Container ref={containerRef} cols={COLS}>
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
