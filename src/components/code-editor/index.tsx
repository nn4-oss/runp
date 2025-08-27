"use client";

import React from "react";
import styled from "styled-components";

import { ScrollArea } from "@usefui/components";

import CodeMirror, { type Extension } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

type CodeEditorProps = {
  readOnly?: boolean;
  value: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
  onChange?: (value: string) => void;
  language?: "jsx" | "tsx" | "ts" | "js";
};

const EditorWrapper = styled(ScrollArea)`
  .cm-foldGutter span {
    color: var(--font-color-alpha-60) !important;
  }
  .cm-lineNumbers .cm-gutterElement {
    color: var(--font-color-alpha-10) !important;
  }
  .cm-scroller {
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
    &::-moz-scrollbar {
      display: none;
    }
  }
`;

const EditorTheme = createTheme({
  theme: "light",
  settings: {
    background: "var(--body-color)",
    backgroundImage: "",
    foreground: "",
    caret: "var(--font-color-alpha-60)",
    selection: "var(--font-color-alpha-10)",
    selectionMatch: "var(--font-color-alpha-10)",
    fontSize: "var(--fontsize-small-60)",
    gutterActiveForeground: "var(--font-color-alpha-30)",
    gutterBackground: "var(--body-color)",
    gutterBorder: "var(--font-color-alpha-10)",
    lineHighlight: "var(--font-color-alpha-10)",
  },
  styles: [
    { tag: t.number, color: "var(--tint-blue-30)" },
    { tag: t.string, color: "var(--shade-green-10)" },
    { tag: t.bracket, color: "var(--font-color)" },
    { tag: t.punctuation, color: "var(--font-color)" },
    { tag: t.comment, color: "var(--font-color-alpha-40)" },
    { tag: t.keyword, color: "var(--tint-purple-30)" },
    { tag: t.function(t.variableName), color: "var(--tint-blue-20)" },
    { tag: t.typeName, color: "var(--tint-orange-30)" },
  ],
});

function CodeEditor({
  value,
  readOnly,
  setValue,
  setError,
  onChange,
  language = "tsx",
}: CodeEditorProps) {
  const languageExtension = React.useMemo(() => {
    return javascript({
      jsx: language === "jsx" || language === "tsx",
      typescript: language === "ts" || language === "tsx",
    });
  }, [language]) as Extension;

  const handleChange = React.useCallback(
    (newValue: string) => {
      setValue?.(newValue);

      try {
        // Ensure code is not empty
        if (!newValue.trim()) {
          setError?.("Code cannot be empty");
        } else {
          setError?.(null);
          onChange?.(newValue);
        }
      } catch (e) {
        if (e instanceof Error) setError?.(e.message);
        else setError?.(`Invalid ${language.toUpperCase()} code`);
      }
    },
    [setValue, language, onChange, setError],
  );

  return (
    <EditorWrapper className="h-100 w-100" scrollbar>
      <CodeMirror
        value={value}
        height="100%"
        onChange={handleChange}
        extensions={[languageExtension]}
        readOnly={readOnly}
        theme={EditorTheme}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          foldGutter: true,
          searchKeymap: false,
        }}
        className="fs-medium-10"
      />
    </EditorWrapper>
  );
}

export default CodeEditor;
