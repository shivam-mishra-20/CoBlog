"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeNode } from "@lexical/code";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef, useCallback } from "react";
import type { EditorState } from "lexical";

import { lexicalTheme } from "./LexicalEditorTheme";
import ToolbarPlugin from "./ToolbarPlugin";

// Plugin to load initial state ONCE
function InitialStatePlugin({ initialState }: { initialState?: string }) {
  const [editor] = useLexicalComposerContext();
  const hasLoadedRef = useRef(false);
  const initialStateRef = useRef(initialState);

  useEffect(() => {
    // Only load the initial state once when component mounts
    // Or when the initialState changes from undefined to defined (for edit mode)
    if (initialState && !hasLoadedRef.current) {
      try {
        const parsedState = editor.parseEditorState(initialState);
        editor.setEditorState(parsedState);
        hasLoadedRef.current = true;
        initialStateRef.current = initialState;
      } catch (error) {
        console.error("Error loading initial state:", error);
      }
    }
  }, [editor, initialState]);

  return null;
}

interface LexicalEditorProps {
  value?: string; // JSON string of editor state
  onChange?: (editorState: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export default function LexicalEditor({
  value,
  onChange,
  placeholder = "Start writing your post...",
  className = "",
  minHeight = "400px",
}: LexicalEditorProps) {
  const changeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initial configuration
  const initialConfig = {
    namespace: "CoBlogEditor",
    theme: lexicalTheme,
    onError: (error: Error) => {
      console.error("Lexical Editor Error:", error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      LinkNode,
      AutoLinkNode,
    ],
  };

  // Handle editor state changes with debounce
  const handleChange = useCallback(
    (editorState: EditorState) => {
      if (onChange) {
        // Clear previous timeout
        if (changeTimeoutRef.current) {
          clearTimeout(changeTimeoutRef.current);
        }

        // Debounce the onChange callback to reduce re-renders
        changeTimeoutRef.current = setTimeout(() => {
          const json = JSON.stringify(editorState.toJSON());
          // Only call onChange if the content actually changed
          onChange(json);
        }, 300); // Increased to 300ms for better performance
      }
    },
    [onChange]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className={`lexical-editor-container relative border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow ${className}`}
      >
        {/* Toolbar */}
        <ToolbarPlugin />

        {/* Editor Content */}
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="lexical-content-editable outline-none px-6 py-4"
                style={{ minHeight }}
                aria-placeholder={placeholder}
                placeholder={
                  <div className="lexical-placeholder absolute top-4 left-6 text-gray-400 dark:text-gray-500 pointer-events-none select-none">
                    {placeholder}
                  </div>
                }
              />
            }
            placeholder={null}
            ErrorBoundary={() => <div>Editor Error</div>}
          />

          {/* Plugins */}
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={handleChange} />
          {value && <InitialStatePlugin initialState={value} />}
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        .lexical-content-editable {
          position: relative;
          resize: vertical;
          font-size: 16px;
          caret-color: rgb(5, 5, 5);
          position: relative;
          tab-size: 1;
          outline: 0;
          padding: 16px 24px;
          caret-color: #444;
        }

        .lexical-content-editable:focus {
          outline: none;
        }

        .lexical-placeholder {
          color: #999;
          overflow: hidden;
          position: absolute;
          text-overflow: ellipsis;
          top: 16px;
          left: 24px;
          font-size: 16px;
          user-select: none;
          display: inline-block;
          pointer-events: none;
        }

        /* Hide placeholder when editor has content */
        .lexical-content-editable:not(:empty) ~ .lexical-placeholder {
          display: none;
        }

        /* Lexical Editor Dark Mode */
        .dark .lexical-content-editable {
          caret-color: #fff;
          color: #fff;
        }

        /* Link styles */
        .lexical-content-editable a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .dark .lexical-content-editable a {
          color: #60a5fa;
        }

        /* Selection styles */
        .lexical-content-editable ::selection {
          background-color: #b4d5fe;
        }

        .dark .lexical-content-editable ::selection {
          background-color: #1e40af;
        }
      `}</style>
    </LexicalComposer>
  );
}
