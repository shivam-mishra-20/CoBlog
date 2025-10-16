"use client";

import { trpc } from "@/lib/trpc/client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, Sparkles } from "lucide-react";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const {
    data: post,
    isLoading,
    error,
  } = trpc.post.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-luxury">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-royal-600 border-r-transparent"></div>
            <p className="mt-6 text-royal-700 text-lg">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-luxury">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center py-16 card-luxury">
            <CardContent>
              <Sparkles className="mx-auto h-16 w-16 text-royal-400 mb-4" />
              <h2 className="text-3xl font-serif font-semibold text-royal-900 mb-2">
                Post not found
              </h2>
              <p className="mt-2 text-royal-600 mb-6">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-luxury">
      <Navigation />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        <Card className="card-luxury overflow-hidden shadow-royal-xl">
          <CardContent className="p-8 md:p-12">
            {/* Header */}
            <div className="mb-8 border-b border-royal-200 pb-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-royal-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-royal-600 mb-6">
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
                  <Clock className="h-4 w-4" />5 min read
                </div>
                {post.createdAt.toString() !== post.updatedAt.toString() && (
                  <span className="text-royal-500">
                    Updated on{" "}
                    {new Date(post.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>

              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/blog?category=${category.id}`}
                    >
                      <Badge
                        variant="luxury"
                        className="cursor-pointer hover:shadow-royal"
                      >
                        {category.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-lg prose-royal max-w-none">
              <style jsx global>{`
                .prose-royal {
                  color: #2a2119;
                }
                .prose-royal h1,
                .prose-royal h2,
                .prose-royal h3,
                .prose-royal h4,
                .prose-royal h5,
                .prose-royal h6 {
                  font-family: "Playfair Display", serif;
                  color: #4a3d2e;
                  font-weight: 700;
                }
                .prose-royal a {
                  color: #8b6f4f;
                  text-decoration: none;
                }
                .prose-royal a:hover {
                  color: #6d5842;
                  text-decoration: underline;
                }
                .prose-royal strong {
                  color: #5a4936;
                  font-weight: 600;
                }
                .prose-royal code {
                  background-color: #f5f0e8;
                  color: #6d5842;
                  padding: 0.2em 0.4em;
                  border-radius: 0.25rem;
                  font-size: 0.875em;
                }
                .prose-royal blockquote {
                  border-left: 4px solid #8b6f4f;
                  padding-left: 1rem;
                  font-style: italic;
                  color: #5a4936;
                }
              `}</style>
              <ReactMarkdown>{post.content}</ReactMarkdown>
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
    </div>
  );
}
