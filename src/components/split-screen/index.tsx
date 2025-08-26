"use client";

import React from "react";
import styled from "styled-components";

const SplitContainer = styled.div`
  position: relative;
`;
const Panel = styled.div<{ width: number }>`
  overflow: hidden;
  width: ${(props) => props.width}%;
`;
const Divider = styled.div<{ $dragging: boolean }>`
  width: var(--measurement-medium-10);
  height: 100%;
  top: 0;

  border-radius: var(--measurement-medium-60);
  background-color: transparent;

  /* background-color: ${(props) =>
    props.$dragging ? "var(--font-color-alpha-10)" : "transparent"}; */

  cursor: col-resize;
  transition: background-color 0.2s;
  position: relative;

  /** Shows DragIndicator on hover */
  &:hover .drag-indicator-handle,
  &:active .drag-indicator-handle {
    opacity: 1;
  }

  .drag-indicator-handle {
    height: ${(props) =>
      props.$dragging
        ? "var(--measurement-large-10)"
        : "var(--measurement-medium-60)"};
  }
`;

const DragHandle = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(var(--measurement-medium-10) * -1);
  right: calc(var(--measurement-medium-10) * -1);
`;
const DragIndicator = styled.div`
  position: fixed;
  width: var(--measurement-medium-10);
  /* height: var(--measurement-medium-60); */
  background-color: var(--font-color-alpha-60);
  border-radius: var(--measurement-large-10);

  opacity: 0;
  transition: all 0.2s;
`;
const DragOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--depth-default-90);
  cursor: col-resize;
`;

type SplitScreenEditorProperties = {
  defaultWidth?: number;
  left: React.ReactNode;
  right: React.ReactNode;
};

function SplitScreen({
  defaultWidth,
  left,
  right,
}: SplitScreenEditorProperties) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [leftWidth, setLeftWidth] = React.useState(defaultWidth ?? 50); // Percentage
  const [isDragging, setIsDragging] = React.useState(false);

  const handleMouseDown = React.useCallback(() => setIsDragging(true), []);
  const handleMouseUp = React.useCallback(() => setIsDragging(false), []);

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Constrain between 20% and 80%
      const threshold = { min: 25, max: 75 };

      const constrainedWidth = Math.min(
        Math.max(newLeftWidth, threshold.min),
        threshold.max,
      );
      setLeftWidth(constrainedWidth);
    },
    [isDragging],
  );

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <React.Fragment>
      <SplitContainer ref={containerRef} className="h-100 flex">
        <Panel width={leftWidth}>{left}</Panel>

        <Divider
          $dragging={isDragging}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <DragHandle
            className="flex align-center justify-center"
            id="drag-handle"
          >
            <DragIndicator className="drag-indicator-handle" />
          </DragHandle>
        </Divider>

        <Panel width={100 - leftWidth}>{right}</Panel>
      </SplitContainer>

      {isDragging && <DragOverlay />}
    </React.Fragment>
  );
}

export default SplitScreen;
