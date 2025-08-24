"use client";

import React, { useRef, useEffect } from "react";
import styled, { css } from "styled-components";

interface ScrollContainerProps {
  $height?: string;
  $width?: string;
  $thumbColor?: string;
  $trackColor?: string;
  $thumbHoverColor?: string;
}

const CustomScrollbar = css<ScrollContainerProps>`
  height: ${({ $height }) => $height ?? "100%"};
  width: ${({ $width }) => $width ?? "100%"};
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    cursor: pointer;

    width: var(--measurement-medium-10);
  }

  &::-webkit-scrollbar-track {
    background: ${({ $trackColor }) => $trackColor ?? "transparent"};
    border-radius: var(--measurement-medium-30);
    border: none;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ $thumbColor }) =>
      $thumbColor ?? "var(--font-color-alpha-10)"};
    border-radius: var(--measurement-medium-30);
    transition: background-color 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ $thumbHoverColor, $thumbColor }) =>
      $thumbHoverColor ?? $thumbColor ?? "var(--font-color-alpha-20)"};
  }

  // Firefox
  scrollbar-width: thin;
  scrollbar-color: ${({ $thumbColor, $trackColor }) =>
    `${$thumbColor ?? "var(--font-color-alpha-10)"} ${
      $trackColor ?? "transparent"
    }`};
`;

const TextAreaContainer = styled.textarea<ScrollContainerProps>`
  background-color: transparent;
  border: none;
  font-size: var(--fontsize-medium-20);

  resize: none;
  max-height: var(--measurement-large-60);
  min-height: auto;
  width: 100%;
  overflow-y: auto;

  &::placeholder {
    color: var(--font-color-alpha-30);
  }

  &:focus-visible {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${CustomScrollbar}
`;

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

function Textarea({ onChange, ...props }: TextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, parseInt(getComputedStyle(textarea).maxHeight))}px`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustHeight();
    onChange?.(e);
  };

  useEffect(() => {
    adjustHeight();
  }, [props.value]);

  return (
    <TextAreaContainer ref={textareaRef} onChange={handleChange} {...props} />
  );
}
Textarea.displayName = "Textarea";

export default Textarea;
