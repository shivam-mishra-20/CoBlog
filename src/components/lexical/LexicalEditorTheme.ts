/**
 * Lexical Editor Theme
 * Defines CSS classes for different editor elements
 */

import type { EditorThemeClasses } from "lexical";

export const lexicalTheme: EditorThemeClasses = {
  // Paragraph
  paragraph: "mb-2 text-base leading-relaxed",

  // Headings
  heading: {
    h1: "text-4xl font-bold mt-6 mb-4 font-serif",
    h2: "text-3xl font-bold mt-5 mb-3 font-serif",
    h3: "text-2xl font-semibold mt-4 mb-2 font-serif",
    h4: "text-xl font-semibold mt-3 mb-2",
    h5: "text-lg font-semibold mt-2 mb-1",
  },

  // Lists
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "list-decimal list-inside ml-4 my-2 space-y-1",
    ul: "list-disc list-inside ml-4 my-2 space-y-1",
    listitem: "ml-2",
    listitemChecked: "line-through opacity-60",
    listitemUnchecked: "",
  },

  // Text formatting
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
    code: "bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono text-sm",
  },

  // Links
  link: "text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer",

  // Code blocks
  code: "bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm my-3 overflow-x-auto block",
  codeHighlight: {
    atrule: "text-purple-400",
    attr: "text-yellow-400",
    boolean: "text-purple-400",
    builtin: "text-cyan-400",
    cdata: "text-gray-400",
    char: "text-green-400",
    class: "text-yellow-400",
    "class-name": "text-yellow-400",
    comment: "text-gray-500 italic",
    constant: "text-purple-400",
    deleted: "text-red-400",
    doctype: "text-gray-400",
    entity: "text-yellow-400",
    function: "text-blue-400",
    important: "text-red-400 font-bold",
    inserted: "text-green-400",
    keyword: "text-purple-400",
    namespace: "text-yellow-400",
    number: "text-orange-400",
    operator: "text-cyan-400",
    prolog: "text-gray-400",
    property: "text-cyan-400",
    punctuation: "text-gray-400",
    regex: "text-orange-400",
    selector: "text-green-400",
    string: "text-green-400",
    symbol: "text-purple-400",
    tag: "text-red-400",
    url: "text-blue-400 underline",
    variable: "text-cyan-400",
  },

  // Quote
  quote: "border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-3 text-gray-700 dark:text-gray-300",

  // Other
  characterLimit: "text-red-500 text-sm",
  embedBlock: {
    base: "relative",
    focus: "outline-none border-2 border-blue-500",
  },
};
