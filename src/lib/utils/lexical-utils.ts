/** Utility functions for Lexical Editor - conversions */

interface LexicalNode {
  type: string;
  text?: string;
  children?: LexicalNode[];
}

/** Convert Lexical editor state JSON to plain text */
export function lexicalToPlainText(jsonString: string): string {
  try {
    const state = JSON.parse(jsonString);
    const root = state.root;

    if (!root || !root.children) {
      return "";
    }

    const extractText = (node: LexicalNode): string => {
      if (node.type === "text") {
        return node.text || "";
      }

      if (node.children && Array.isArray(node.children)) {
        return node.children.map(extractText).join("");
      }

      return "";
    };

    return root.children.map(extractText).join("\n");
  } catch (error) {
    console.error("Error converting Lexical to plain text:", error);
    return "";
  }
}

/** Convert plain text/markdown to a basic Lexical editor state */
export function plainTextToLexical(text: string): string {
  // Build basic Lexical state from paragraphs
  const paragraphs = text.split("\n\n").filter((p) => p.trim());

  const children = paragraphs.map((paragraph) => ({
    children: [
      {
        detail: 0,
        format: 0,
        mode: "normal",
        style: "",
        text: paragraph,
        type: "text",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "paragraph",
    version: 1,
  }));

  const editorState = {
    root: {
      children,
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };

  return JSON.stringify(editorState);
}

/** Check if a string is valid Lexical JSON */
export function isLexicalJSON(value: string): boolean {
  try {
    const parsed = JSON.parse(value);
    return (
      parsed &&
      typeof parsed === "object" &&
      parsed.root &&
      parsed.root.type === "root"
    );
  } catch {
    return false;
  }
}

/** Get word count from Lexical editor state */
export function getLexicalWordCount(jsonString: string): number {
  const plainText = lexicalToPlainText(jsonString);
  return plainText.split(/\s+/).filter((word) => word.length > 0).length;
}

/** Get character count from Lexical editor state */
export function getLexicalCharCount(jsonString: string): number {
  const plainText = lexicalToPlainText(jsonString);
  return plainText.length;
}

/** Export to HTML (placeholder) */
export function lexicalToHTML(jsonString: string): string {
  try {
    const plainText = lexicalToPlainText(jsonString);
    return `<div>${plainText.split("\n").map((p) => `<p>${p}</p>`).join("")}</div>`;
  } catch (error) {
    console.error("Error converting Lexical to HTML:", error);
    return "";
  }
}
