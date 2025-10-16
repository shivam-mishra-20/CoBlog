"use client";

import { trpc } from "@/lib/trpc/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Sparkles,
  FileText,
  Eye,
} from "lucide-react";
import {
  calculatePostStats,
  formatReadingTime,
  formatWordCount,
} from "@/lib/utils/post-stats";
import {
  isLexicalJSON,
  getLexicalWordCount,
  lexicalToPlainText,
} from "@/lib/utils/lexical-utils";
import { LexicalReadOnly } from "@/components/lexical";
import { useEffect } from "react";
//import Head from "next/head";
import Image from "next/image";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const {
    data: post,
    isLoading,
    error,
  } = trpc.post.getBySlug.useQuery({ slug });

  // Post stats (handle Lexical or plain text)
  const stats = post
    ? isLexicalJSON(post.content)
      ? {
          wordCount: getLexicalWordCount(post.content),
          charCount: lexicalToPlainText(post.content).length,
          readingTimeMinutes: Math.ceil(
            getLexicalWordCount(post.content) / 200
          ),
        }
      : calculatePostStats(post.content)
    : null;

  // Update metadata
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | CoBlog`;

      // Meta description
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          post.excerpt || post.content.substring(0, 160)
        );
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = post.excerpt || post.content.substring(0, 160);
        document.head.appendChild(meta);
      }

      // Open Graph tags
      const updateOrCreateMetaTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (meta) {
          meta.setAttribute("content", content);
        } else {
          meta = document.createElement("meta");
          meta.setAttribute("property", property);
          meta.setAttribute("content", content);
          document.head.appendChild(meta);
        }
      };

      updateOrCreateMetaTag("og:title", post.title);
      updateOrCreateMetaTag(
        "og:description",
        post.excerpt || post.content.substring(0, 160)
      );
      updateOrCreateMetaTag("og:type", "article");
      if (post.featuredImage) {
        updateOrCreateMetaTag("og:image", post.featuredImage);
      }

      // Twitter Card tags
      updateOrCreateMetaTag("twitter:card", "summary_large_image");
      updateOrCreateMetaTag("twitter:title", post.title);
      updateOrCreateMetaTag(
        "twitter:description",
        post.excerpt || post.content.substring(0, 160)
      );
      if (post.featuredImage) {
        updateOrCreateMetaTag("twitter:image", post.featuredImage);
      }
    }
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-6 text-muted-foreground text-lg">
              Loading post...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center py-16 card-luxury">
            <CardContent>
              <Sparkles className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-3xl font-serif font-semibold mb-2">
                Post not found
              </h2>
              <p className="mt-2 text-muted-foreground mb-6">
                The post you&apos;re looking for doesn&apos;t exist.
              </p>
              <Button asChild variant="default" size="lg">
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt || post.content.substring(0, 160),
            image: post.featuredImage || "",
            datePublished: post.createdAt,
            dateModified: post.updatedAt,
            author: {
              "@type": "Person",
              name: "CoBlog Author",
            },
            publisher: {
              "@type": "Organization",
              name: "CoBlog",
              logo: {
                "@type": "ImageObject",
                url: "/coblog-logo.png",
              },
            },
            wordCount: stats?.wordCount || 0,
            articleBody: post.content,
          }),
        }}
      />

      <div className="min-h-screen bg-background">
        <Navigation />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <Card className="card-luxury overflow-hidden shadow-royal-lg">
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative w-full h-64 md:h-96">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <CardContent className="p-8 md:p-12">
              {/* Header */}
              <div className="mb-8 border-b border-border pb-8">
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Post Statistics */}
                {stats && (
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={post.createdAt.toString()}>
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formatReadingTime(stats.readingTimeMinutes)}
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {formatWordCount(stats.wordCount)} words
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Published
                    </div>
                  </div>
                )}

                {/* Update info */}
                {post.createdAt.toString() !== post.updatedAt.toString() && (
                  <p className="text-sm text-muted-foreground mb-6">
                    Last updated on{" "}
                    {new Date(post.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}

                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/blog?category=${category.id}`}
                      >
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:shadow-royal"
                        >
                          {category.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Content - Lexical Rich Text Display */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <style jsx global>{`
                  .prose {
                    color: hsl(var(--foreground));
                  }
                  .prose h1,
                  .prose h2,
                  .prose h3,
                  .prose h4,
                  .prose h5,
                  .prose h6 {
                    font-family: "Playfair Display", serif;
                    color: hsl(var(--foreground));
                    font-weight: 700;
                    margin-top: 2em;
                    margin-bottom: 1em;
                  }
                  .prose a {
                    color: hsl(var(--primary));
                    text-decoration: none;
                    font-weight: 500;
                  }
                  .prose a:hover {
                    text-decoration: underline;
                  }
                  .prose strong {
                    color: hsl(var(--foreground));
                    font-weight: 600;
                  }
                  .prose code {
                    background-color: hsl(var(--muted));
                    color: hsl(var(--foreground));
                    padding: 0.2em 0.4em;
                    border-radius: 0.25rem;
                    font-size: 0.875em;
                  }
                  .prose pre {
                    background-color: hsl(var(--muted));
                    padding: 1rem;
                    border-radius: 0.5rem;
                    overflow-x: auto;
                  }
                  .prose blockquote {
                    border-left: 4px solid hsl(var(--primary));
                    padding-left: 1rem;
                    font-style: italic;
                    color: hsl(var(--muted-foreground));
                  }
                  .prose ul,
                  .prose ol {
                    padding-left: 1.5rem;
                  }
                  .prose img {
                    border-radius: 0.5rem;
                    margin: 2rem 0;
                  }
                `}</style>
                <LexicalReadOnly content={post.content} />
              </div>
            </CardContent>
          </Card>

          {/* Back to Blog Link */}
          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to all posts
              </Link>
            </Button>
          </div>
        </article>

        <Footer />
      </div>
    </>
  );
}
