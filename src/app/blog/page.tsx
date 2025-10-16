"use client";

import { trpc } from "@/lib/trpc/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { Pagination } from "@/components/Pagination";
import Link from "next/link";
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Calendar, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculatePostStats, formatReadingTime } from "@/lib/utils/post-stats";
import Image from "next/image";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading: postsLoading } = trpc.post.getAll.useQuery({
    categoryId: selectedCategory,
    published: true,
    search: searchQuery || undefined,
    page: currentPage,
    limit: 9,
  });

  const { data: categories } = trpc.category.getAll.useQuery();

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCategoryChange = useCallback((categoryId: number | undefined) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page on category change
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-50 via-cream-50 to-brown-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4">
            <BookOpen className="h-10 w-10 text-royal-600 dark:text-royal-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-royal-900 dark:text-royal-100">
            Blog{" "}
            <span className="bg-gradient-to-r from-royal-700 via-royal-600 to-brown-700 dark:from-royal-400 dark:via-royal-300 dark:to-brown-400 bg-clip-text text-transparent">
              Posts
            </span>
          </h1>
          <p className="mt-2 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our latest articles, stories, and insights
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 flex justify-center">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search posts by title or content..."
            defaultValue={searchQuery}
          />
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={() => handleCategoryChange(undefined)}
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
                onClick={() => handleCategoryChange(category.id)}
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
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-6 text-muted-foreground text-lg">
              Loading posts...
            </p>
          </div>
        ) : data?.posts && data.posts.length > 0 ? (
          <>
            {/* Results count */}
            <div className="mb-6 text-center text-muted-foreground">
              Showing {data.posts.length} of {data.pagination.total} posts
              {searchQuery && ` for "${searchQuery}"`}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up mb-12">
              {data.posts.map((post) => {
                const stats = calculatePostStats(post.content);
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group"
                  >
                    <Card className="h-full hover:scale-105 transition-all duration-300 border-royal-200 dark:border-royal-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm group-hover:shadow-royal-lg overflow-hidden">
                      {/* Featured Image */}
                      {post.featuredImage && (
                        <div className="relative w-full h-48 overflow-hidden bg-royal-100 dark:bg-royal-900">
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <CardHeader>
                        <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {post.excerpt && (
                          <p className="text-muted-foreground line-clamp-3 leading-relaxed text-sm">
                            {post.excerpt}
                          </p>
                        )}

                        {post.categories && post.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.categories.map((cat) => (
                              <Badge key={cat.id} variant="secondary">
                                {cat.name}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(post.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatReadingTime(stats.readingTimeMinutes)}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" />
                            {stats.wordCount} words
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className="mt-12 mb-8">
                <Pagination
                  currentPage={data.pagination.page}
                  totalPages={data.pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <Card className="max-w-md mx-auto card-luxury">
              <CardContent className="pt-10 pb-10">
                <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-2">
                  No posts found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? `No posts found for "${searchQuery}". Try a different search term.`
                    : selectedCategory
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

      <Footer />
    </div>
  );
}
