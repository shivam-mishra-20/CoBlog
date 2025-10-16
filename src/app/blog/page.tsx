"use client";

import { trpc } from "@/lib/trpc/client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined
  );

  const { data: posts, isLoading: postsLoading } = trpc.post.getAll.useQuery({
    categoryId: selectedCategory,
    published: true,
  });

  const { data: categories } = trpc.category.getAll.useQuery();

  return (
    <div className="min-h-screen bg-gradient-luxury">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4">
            <BookOpen className="h-10 w-10 text-royal-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-royal-900 mb-4">
            Blog <span className="text-gradient-royal">Posts</span>
          </h1>
          <p className="mt-2 text-lg md:text-xl text-royal-700 max-w-2xl mx-auto">
            Explore our latest articles, stories, and insights
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={() => setSelectedCategory(undefined)}
              variant={selectedCategory === undefined ? "default" : "outline"}
              size="lg"
              className={cn(
                "transition-all",
                selectedCategory === undefined && "shadow-royal-lg"
              )}
            >
              All Posts
            </Button>
            {categories?.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="lg"
                className={cn(
                  "transition-all",
                  selectedCategory === category.id && "shadow-royal-lg"
                )}
              >
                {category.name} ({category.postCount})
              </Button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {postsLoading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-royal-600 border-r-transparent"></div>
            <p className="mt-6 text-royal-700 text-lg">Loading posts...</p>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full hover:scale-105 transition-all duration-300 card-luxury group-hover:shadow-royal-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl line-clamp-2 group-hover:text-royal-800 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {post.excerpt && (
                      <p className="text-royal-600 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}

                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.categories.map((cat) => (
                          <Badge key={cat.id} variant="luxury">
                            {cat.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-royal-600 pt-2 border-t border-royal-200">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />5 min read
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Card className="max-w-md mx-auto card-luxury">
              <CardContent className="pt-10 pb-10">
                <BookOpen className="mx-auto h-16 w-16 text-royal-400 mb-4" />
                <h3 className="text-xl font-serif font-semibold text-royal-900 mb-2">
                  No posts found
                </h3>
                <p className="text-royal-600 mb-6">
                  {selectedCategory
                    ? "No posts in this category yet."
                    : "Get started by creating your first post."}
                </p>
                <Button asChild variant="default" size="lg">
                  <Link href="/dashboard">Create Post</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
