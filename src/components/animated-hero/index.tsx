"use client";

import React from "react";
import styled, { keyframes } from "styled-components";

interface Position {
  absX: number; // Absolute X coordinate (normalized 0-1, offset by π/10)
  absY: number; // Absolute Y coordinate (normalized 0-1, offset by π/10)
  char: string; // Character to display in this cell
}

/**
 * Tracks the animation state of each individual cell
 */
interface CellState {
  nextChange: number; // Timestamp when cell should next toggle visibility
  isVisible: boolean; // Current visibility state
  opacity: number; // Current opacity value (smoothly interpolated)
}

/**
 * Grid Layout Configuration
 * - COLS: Fixed number of columns (24 provides good density)
 * - CELLS: Total number of grid cells (512 creates rich pattern)
 * - ROWS: Calculated rows needed to fit all cells
 */
const COLS = 12;
const CELLS = 128;
const ROWS = Math.ceil(CELLS / COLS);

/**
 * Visibility Constraint
 * This creates a sparse, controlled visual density.
 */
const MAX_VISIBLE_CELLS = Math.floor(CELLS * (1 / 3));

/**
 * Animation Timing Constants
 * - INITIAL_VISIBILITY_CHANCE: Probability each cell starts visible (1%)
 * - OPACITY_TRANSITION_SPEED: How quickly opacity changes (0.05 = smooth)
 * - MIN/MAX_CHANGE_DELAY: Random delay range between visibility toggles
 *   Using golden ratio (1618ms) for aesthetically pleasing timing
 */
const INITIAL_VISIBILITY_CHANCE = 0.01;
const OPACITY_TRANSITION_SPEED = 0.05;
const MIN_OPACITY = 0.05;
const MIN_CHANGE_DELAY = 1618; // Golden ratio in milliseconds
const MAX_CHANGE_DELAY = 1618 * 4;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0;
  left: 0;
  margin: 0 auto;

  overflow: hidden;
  user-select: none;
  pointer-events: none;
  z-index: 0;
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

const fadeIn = keyframes`
  from {
    opacity: 0; /* Default opacity to 0 prevents ui glitches on page load */
  }
  to {
    opacity: ${MIN_OPACITY / 2};
  }
`;
const Cell = styled.div`
  user-select: none; /* Prevent text selection */
  pointer-events: none; /* Prevent mouse interaction */
  will-change: opacity; /* Browser optimization hint */

  opacity: 0;
  transition: all 0.2s ease-in-out;
  animation: ${fadeIn} 1s ease-in-out;

  span {
    font-size: var(--fontsize-small-10);
    text-transform: uppercase;
  }
`;

/**
 * AnimatedHero Component
 *
 * @param chars - String of characters to cycle through in the grid
 *                Each cell displays chars[cellIndex % chars.length]
 */
function AnimatedHero({ chars }: { chars: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const totalCells = COLS * ROWS;

  /**
   * POSITION CALCULATION
   *
   * Pre-calculates position data for all grid cells.
   * Uses mathematical offset (π/10) to create slight irregularity
   * in what would otherwise be a perfectly uniform grid.
   */
  const positions = React.useMemo((): Position[] => {
    return Array.from({ length: totalCells }, (_, i) => {
      // Calculate grid coordinates
      const x = ((i + 1) % COLS) / COLS - Math.PI / 10; // 0-1 range with π offset
      const y = (ROWS - Math.floor(i / COLS)) / ROWS - Math.PI / 10; // Inverted Y

      return {
        absX: Math.abs(x), // Remove negative values
        absY: Math.abs(y),
        char: chars[i % chars.length] ?? "0", // Cycle through chars, fallback to "0"
      };
    });
  }, [chars, totalCells]);

  /**
   * ANIMATION EFFECT
   *
   * Manages the core animation loop and visibility constraint algorithm.
   */
  React.useEffect(() => {
    const cells = containerRef.current?.children;
    if (!cells) return; // Exit if DOM elements not ready

    let animationId: number;
    const startTime = performance.now(); // High-precision timestamp

    // INITIALIZATION: Set up random initial state for all cells
    const cellStates: CellState[] = positions.map(() => ({
      nextChange: Math.random() * (Math.PI * 1e4), // Random initial delay
      isVisible: Math.random() < INITIAL_VISIBILITY_CHANCE, // 1% chance visible
      opacity: MIN_OPACITY, // Start with minimal opacity
    }));

    // CONSTRAINT ENFORCEMENT: Ensure initial state respects visibility limit
    const initialVisibleCount = cellStates.filter((s) => s.isVisible).length;

    if (initialVisibleCount > MAX_VISIBLE_CELLS) {
      // Get indices of all currently visible cells
      const visibleIndices = cellStates
        .map((s, i) => (s.isVisible ? i : -1))
        .filter((i) => i !== -1);

      // Calculate how many cells we need to turn off
      const excessCount = initialVisibleCount - MAX_VISIBLE_CELLS;

      // Randomly select and turn off excess visible cells
      for (let i = 0; i < excessCount && visibleIndices.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * visibleIndices.length);
        const cellIndex = visibleIndices.splice(randomIndex, 1)[0];

        // Safety check before array access
        if (cellIndex !== undefined && cellStates[cellIndex]) {
          cellStates[cellIndex].isVisible = false;
        }
      }
    }

    // ANIMATION LOOP: Core visibility and opacity management
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      // Process each cell's state
      cellStates.forEach((state, index) => {
        // Check if it's time for this cell to change visibility
        if (elapsed > state.nextChange) {
          const currentVisibleCount = cellStates.filter(
            (s) => s.isVisible,
          ).length;

          if (!state.isVisible) {
            // CASE 1: Cell wants to become visible

            if (currentVisibleCount < MAX_VISIBLE_CELLS) {
              // Space available - simply turn on
              state.isVisible = true;
            } else {
              // AT CAPACITY - need to replace a visible cell

              // Find all visible cells (excluding current cell)
              const visibleIndices = cellStates
                .map((s, i) => (s.isVisible ? i : -1))
                .filter((i) => i !== -1 && i !== index);

              if (visibleIndices.length > 0) {
                // Randomly select a visible cell to turn off
                const randomVisibleIndex =
                  visibleIndices[
                    Math.floor(Math.random() * visibleIndices.length)
                  ];

                // Safety check and replacement logic
                if (
                  randomVisibleIndex !== undefined &&
                  cellStates[randomVisibleIndex]
                ) {
                  // Turn off the selected visible cell
                  cellStates[randomVisibleIndex].isVisible = false;
                  cellStates[randomVisibleIndex].nextChange =
                    elapsed +
                    MIN_CHANGE_DELAY +
                    Math.random() * (MAX_CHANGE_DELAY - MIN_CHANGE_DELAY);

                  // Turn on the current cell
                  state.isVisible = true;
                }
              }
            }
          } else {
            // CASE 2: Cell wants to become invisible
            // Always allowed - helps maintain visual dynamism
            state.isVisible = false;
          }

          // Schedule next change with random delay
          state.nextChange =
            elapsed +
            MIN_CHANGE_DELAY +
            Math.random() * (MAX_CHANGE_DELAY - MIN_CHANGE_DELAY);
        }

        // OPACITY ANIMATION: Smooth transitions between visible/invisible

        // Set target opacity based on visibility state
        // 0.1618 ≈ golden ratio conjugate for visible cells
        const targetOpacity = state.isVisible ? 0.1618 : 0.03;

        // Smoothly interpolate current opacity toward target
        state.opacity +=
          (targetOpacity - state.opacity) * OPACITY_TRANSITION_SPEED;

        // Apply opacity to actual DOM element
        const cellElement = cells[index] as HTMLElement;
        cellElement.style.opacity = state.opacity.toString();
      });

      // Schedule next animation frame
      animationId = requestAnimationFrame(animate);
    };

    // Start the animation loop
    animationId = requestAnimationFrame(animate);

    // Cleanup: Cancel animation when component unmounts
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [positions]); // Re-run if positions change (when chars prop changes)

  // RENDER: Generate grid structure with character cells
  return (
    <Wrapper tabIndex={-1}>
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
