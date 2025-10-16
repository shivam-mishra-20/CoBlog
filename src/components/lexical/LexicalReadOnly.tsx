"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeNode } from "@lexical/code";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

import { lexicalTheme } from "./LexicalEditorTheme";
import { isLexicalJSON, plainTextToLexical } from "@/lib/utils/lexical-utils";

function ReadOnlyStatePlugin({ state }: { state: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (state) {
      try {
        // Convert plain text if needed
        const lexicalState = isLexicalJSON(state)
          ? state
          : plainTextToLexical(state);

        const parsedState = editor.parseEditorState(lexicalState);
        editor.setEditorState(parsedState);
        editor.setEditable(false);
      } catch (error) {
        console.error("Error loading read-only state:", error);
      }
    }
  }, [editor, state]);

  return null;
}

interface LexicalReadOnlyProps {
  content: string;
  className?: string;
}

/**
 * Read-only Lexical Editor for displaying published posts
 */
export default function LexicalReadOnly({
  content,
  className = "",
}: LexicalReadOnlyProps) {
  const initialConfig = {
    namespace: "CoBlogReadOnly",
    theme: lexicalTheme,
    editable: false,
    onError: (error: Error) => {
      console.error("Lexical Read-Only Error:", error);
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

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={`lexical-readonly ${className}`}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="lexical-content-editable-readonly outline-none focus:outline-none" />
          }
          placeholder={null}
          ErrorBoundary={() => null}
        />
        <ReadOnlyStatePlugin state={content} />
      </div>

      <style jsx global>{`
        .lexical-readonly {
          font-size: 18px;
          line-height: 1.7;
        }

        .lexical-content-editable-readonly {
          outline: none;
          position: relative;
          user-select: text;
        }

        .lexical-content-editable-readonly * {
          cursor: default;
        }

        .lexical-content-editable-readonly a {
          cursor: pointer;
        }
      `}</style>
    </LexicalComposer>
  );
}
