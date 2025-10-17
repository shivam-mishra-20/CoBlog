"use client";

import { trpc } from "@/lib/trpc/client";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Clock,
  Heart,
  MessageCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { calculatePostStats } from "@/lib/utils/post-stats";

export default function LatestPosts() {
  const { data, isLoading } = trpc.post.getAll.useQuery({
    published: true,
    page: 1,
    limit: 6,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-royal-600 dark:text-royal-400" />
      </div>
    );
  }

  if (!data || data.posts.length === 0) {
    return (
      <div className="text-center py-20">
        <BookOpen className="h-16 w-16 mx-auto text-royal-400 dark:text-royal-600 mb-4" />
        <h3 className="text-2xl font-serif font-bold text-royal-900 dark:text-royal-100 mb-2">
          No posts yet
        </h3>
        <p className="text-royal-700 dark:text-royal-300 mb-6">
          Be the first to create a post!
        </p>
        <Button asChild>
          <Link href="/dashboard">Create Your First Post</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.posts.map((post) => {
          const stats = calculatePostStats(post.content);
          return (
            <Card
              key={post.id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-royal-200 dark:border-royal-800 bg-white dark:bg-gray-900"
            >
              <div className="relative h-48 bg-gradient-to-br from-royal-200 to-brown-200 dark:from-royal-800 dark:to-brown-800 overflow-hidden">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-royal-400 dark:text-royal-600" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 dark:bg-gray-900/90 text-royal-800 dark:text-royal-200">
                    <Clock className="h-3 w-3 mr-1" />
                    {stats.readingTimeMinutes} min
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.categories.slice(0, 2).map((category) => (
                    <Badge
                      key={category.id}
                      variant="outline"
                      className="text-xs"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-xl font-serif line-clamp-2 group-hover:text-royal-700 dark:group-hover:text-royal-400 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 mb-4">
                  {post.excerpt || "Read this amazing post..."}
                </CardDescription>
                <div className="flex items-center justify-between text-sm text-royal-600 dark:text-royal-400">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-royal-400 to-brown-500 flex items-center justify-center text-white text-xs font-semibold">
                      {post.title[0].toUpperCase()}
                    </div>
                    <span className="font-medium">Author</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {Math.floor(Math.random() * 100)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {Math.floor(Math.random() * 50)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center md:hidden">
        <Button asChild variant="outline" size="lg">
          <Link href="/blog">
            View All Posts <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </>
  );
}
