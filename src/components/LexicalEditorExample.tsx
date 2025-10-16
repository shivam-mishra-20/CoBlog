"use client";

import { useState } from "react";
import { LexicalEditor, LexicalReadOnly } from "@/components/lexical";
import {
  lexicalToPlainText,
  getLexicalWordCount,
  getLexicalCharCount,
} from "@/lib/utils/lexical-utils";

/**
 * Example component showcasing the Lexical Rich Text Editor
 * This demonstrates how to use the editor in your blog forms
 */
export default function LexicalEditorExample() {
  const [editorContent, setEditorContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleEditorChange = (newContent: string) => {
    setEditorContent(newContent);
    console.log("Editor content changed:", newContent);
  };

  const handleSave = () => {
    // Save handler (example)
    console.log("Saving content:", editorContent);

    const plainText = lexicalToPlainText(editorContent);
    console.log("Plain text version:", plainText);

    alert("Content saved! Check console for details.");
  };

  const stats = editorContent
    ? {
        words: getLexicalWordCount(editorContent),
        chars: getLexicalCharCount(editorContent),
      }
    : { words: 0, chars: 0 };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold font-serif">
          Lexical Rich Text Editor Demo
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Professional Notion-like editing experience for your blog posts
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <div>
          <span className="font-semibold">{stats.words}</span> words
        </div>
        <div>
          <span className="font-semibold">{stats.chars}</span> characters
        </div>
        <div>
          <span className="font-semibold">{Math.ceil(stats.words / 200)}</span>{" "}
          min read
        </div>
      </div>

      {/* Editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Editor</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
            <button
              onClick={handleSave}
              disabled={!editorContent}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Content
            </button>
          </div>
        </div>

        <LexicalEditor
          value={editorContent}
          onChange={handleEditorChange}
          placeholder="Start writing something amazing..."
          minHeight="500px"
        />
      </div>

      {/* Preview */}
      {showPreview && editorContent && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Preview (Read-Only)</h2>
          <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
            <LexicalReadOnly content={editorContent} />
          </div>
        </div>
      )}

      {/* Features List */}
      <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg space-y-4">
        <h3 className="text-xl font-semibold">✨ Editor Features</h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li>✅ Rich text formatting (Bold, Italic, Underline)</li>
          <li>✅ Multiple heading levels (H1, H2, H3)</li>
          <li>✅ Bullet and numbered lists</li>
          <li>✅ Block quotes for emphasis</li>
          <li>✅ Hyperlink insertion</li>
          <li>✅ Undo/Redo support</li>
          <li>✅ Markdown shortcuts (type ** for bold, * for italic, etc.)</li>
          <li>✅ Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U)</li>
          <li>✅ Saves as JSON (easily convertible to HTML or plain text)</li>
          <li>✅ Responsive and mobile-friendly</li>
          <li>✅ Dark mode compatible</li>
        </ul>
      </div>

      {/* Usage Guide */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4">
        <h3 className="text-xl font-semibold">📖 How to Use in Your Forms</h3>
        <div className="space-y-2 text-sm">
          <p className="font-mono bg-white dark:bg-gray-900 p-3 rounded">
            {`import { LexicalEditor } from "@/components/lexical";`}
          </p>
          <p className="font-mono bg-white dark:bg-gray-900 p-3 rounded">
            {`const [content, setContent] = useState("");`}
          </p>
          <p className="font-mono bg-white dark:bg-gray-900 p-3 rounded">
            {`<LexicalEditor
  value={content}
  onChange={setContent}
  placeholder="Write something..."
/>`}
          </p>
        </div>
      </div>
    </div>
  );
}
