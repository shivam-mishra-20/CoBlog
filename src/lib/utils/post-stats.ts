import readingTime from "reading-time";

export interface PostStats {
  wordCount: number;
  readingTime: string;
  readingTimeMinutes: number;
}

/**
 * Calculate word count and reading time for a given text
 * @param text - The text content to analyze
 * @returns Object containing word count and reading time
 */
export function calculatePostStats(text: string): PostStats {
  // Remove markdown syntax for accurate word count
  const plainText = text
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]*`/g, "") // Remove inline code
    .replace(/#{1,6}\s/g, "") // Remove headers
    .replace(/[*_~`]/g, "") // Remove markdown formatting
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Replace links with text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Remove images
    .trim();

  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const stats = readingTime(plainText);

  return {
    wordCount,
    readingTime: stats.text,
    readingTimeMinutes: Math.ceil(stats.minutes),
  };
}

/**
 * Format reading time in a human-readable format
 * @param minutes - Number of minutes to read
 * @returns Formatted reading time string
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return "< 1 min read";
  if (minutes === 1) return "1 min read";
  return `${minutes} min read`;
}

/**
 * Format word count with commas
 * @param count - Word count to format
 * @returns Formatted word count string
 */
export function formatWordCount(count: number): string {
  return count.toLocaleString();
}
