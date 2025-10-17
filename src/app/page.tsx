import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sparkles,
  BookOpen,
  TrendingUp,
  Zap,
  ArrowRight,
  Edit3,
  Eye,
  Share2,
  CheckCircle2,
  Pen,
  Layers,
  Globe,
  Quote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LatestPosts from "@/components/LatestPosts";

export default function HomePage() {
  const features = [
    {
      icon: Edit3,
      title: "Rich Editor",
      description:
        "Advanced Lexical editor with live preview, formatting tools, and seamless content creation experience.",
    },
    {
      icon: Eye,
      title: "Live Preview",
      description:
        "See exactly how your post will look while you write. No surprises, just perfection.",
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description:
        "Share your posts instantly with SEO-optimized links and beautiful social media previews.",
    },
    {
      icon: Layers,
      title: "Category Management",
      description:
        "Organize content with flexible categories. Help readers discover what they love.",
    },
    {
      icon: Globe,
      title: "SEO Optimized",
      description:
        "Built-in SEO best practices, meta tags, and structured data for better discoverability.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Built with Next.js 15 and modern tech stack for blazing fast performance.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description:
        "Sign up in seconds and start your blogging journey with CoBlog.",
    },
    {
      number: "02",
      title: "Write Your Story",
      description:
        "Use our intuitive editor to craft beautiful, engaging content.",
    },
    {
      number: "03",
      title: "Share & Grow",
      description:
        "Publish your posts and connect with readers who love your work.",
    },
  ];

  const testimonials = [
    {
      quote:
        "CoBlog has transformed how I share my ideas. The editor is intuitive and the platform is beautiful!",
      author: "Sarah Chen",
      role: "Tech Writer",
      avatar: "SC",
    },
    {
      quote:
        "Finally, a blogging platform that doesn't get in the way of creativity. Love the live preview feature!",
      author: "Marcus Johnson",
      role: "Content Creator",
      avatar: "MJ",
    },
    {
      quote:
        "The SEO optimization and clean design helped my blog reach 10x more readers in just weeks!",
      author: "Emily Rodriguez",
      role: "Digital Marketer",
      avatar: "ER",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-50 via-cream-50 to-brown-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-royal-300/20 dark:bg-royal-700/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute top-60 -left-40 w-96 h-96 bg-brown-300/15 dark:bg-brown-700/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-40 right-1/3 w-64 h-64 bg-royal-200/20 dark:bg-royal-600/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-6 animate-bounce">
              <Sparkles className="h-14 w-14 text-royal-600 dark:text-royal-400" />
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-royal-900 dark:text-royal-100 mb-8 leading-tight">
              Write, Share, Remix —{" "}
              <span className="block mt-2 bg-gradient-to-r from-royal-700 via-royal-600 to-brown-700 dark:from-royal-400 dark:via-royal-300 dark:to-brown-400 bg-clip-text text-transparent">
                Your Ideas, Amplified
              </span>
            </h1>

            <p className="mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-royal-700 dark:text-royal-300 font-light leading-relaxed">
              Create posts, engage readers, and grow your online presence
              effortlessly with our elegant blogging platform.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="xl"
                className="bg-royal-700 hover:bg-royal-800 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <Link href="/dashboard">
                  <Pen className="mr-2 h-5 w-5" />
                  Create Your First Post
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="xl"
                className="border-2 dark:hover:bg-royal-900"
              >
                <Link href="/blog">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Explore Trending Posts
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-royal-800 dark:text-royal-300 mb-2">
                  10K+
                </div>
                <div className="text-sm text-royal-600 dark:text-royal-400">
                  Posts Created
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-royal-800 dark:text-royal-300 mb-2">
                  5K+
                </div>
                <div className="text-sm text-royal-600 dark:text-royal-400">
                  Active Writers
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-royal-800 dark:text-royal-300 mb-2">
                  50K+
                </div>
                <div className="text-sm text-royal-600 dark:text-royal-400">
                  Daily Readers
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-royal-800 dark:text-royal-300 mb-2">
                  100K+
                </div>
                <div className="text-sm text-royal-600 dark:text-royal-400">
                  Engagements
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 md:py-12 relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-royal-100 text-royal-800 dark:bg-royal-900 dark:text-royal-200">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-royal-900 dark:text-royal-100 mb-6">
              Everything You Need to Blog
            </h2>
            <p className="text-lg md:text-xl text-royal-700 dark:text-royal-300 max-w-3xl mx-auto">
              Powerful features designed to help you create, share, and grow
              your audience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-royal-200 dark:border-royal-800 bg-white dark:bg-gray-900 overflow-hidden"
              >
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-royal-500 to-brown-600 dark:from-royal-600 dark:to-brown-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-serif">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge className="mb-4 bg-royal-100 text-royal-800 dark:bg-royal-900 dark:text-royal-200">
                Latest Content
              </Badge>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-royal-900 dark:text-royal-100 mb-4">
                Trending Posts
              </h2>
              <p className="text-lg text-royal-700 dark:text-royal-300">
                Discover the latest stories from our community
              </p>
            </div>
            <Button asChild variant="ghost" className="hidden md:flex">
              <Link href="/blog">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <LatestPosts />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 relative bg-gradient-to-br from-royal-900 via-royal-800 to-brown-900 dark:from-royal-950 dark:via-royal-900 dark:to-brown-950">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwIDkuOTQtOC4wNiAxOC0xOCAxOHMtMTgtOC4wNi0xOC0xOCA4LjA2LTE4IDE4LTE4IDE4IDguMDYgMTggMTh6IiBzdHJva2U9IiNmYWY4ZjUiIHN0cm9rZS1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
              Start Blogging in Minutes
            </h2>
            <p className="text-lg md:text-xl text-royal-100 max-w-3xl mx-auto">
              Three simple steps to share your stories with the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center group">
                {/* Connector Line (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-white/20">
                    <div className="h-full bg-gradient-to-r from-white/40 to-transparent w-0 group-hover:w-full transition-all duration-500" />
                  </div>
                )}

                <div className="relative z-10 mb-6 inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border-2 border-white/30 group-hover:scale-110 transition-transform">
                  <span className="text-5xl font-bold text-white font-serif">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-royal-100 text-base leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button
              asChild
              size="xl"
              className="bg-white text-royal-900 hover:bg-royal-50 shadow-2xl hover:scale-105 transition-all"
            >
              <Link href="/dashboard">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Get Started Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-royal-100 text-royal-800 dark:bg-royal-900 dark:text-royal-200">
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-royal-900 dark:text-royal-100 mb-6">
              Loved by Writers Everywhere
            </h2>
            <p className="text-lg md:text-xl text-royal-700 dark:text-royal-300 max-w-3xl mx-auto">
              Join thousands of creators who trust CoBlog for their blogging
              needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="relative overflow-hidden border-royal-200 dark:border-royal-800 bg-white dark:bg-gray-900 hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <Quote className="h-10 w-10 text-royal-300 dark:text-royal-700 mb-4" />
                  <CardDescription className="text-base text-royal-800 dark:text-royal-200 leading-relaxed italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-royal-500 to-brown-600 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-royal-900 dark:text-royal-100">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-royal-600 dark:text-royal-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-600 via-royal-700 to-brown-700 dark:from-royal-800 dark:via-royal-900 dark:to-brown-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwIDkuOTQtOC4wNiAxOC0xOCAxOHMtMTgtOC4wNi0xOC0xOCA4LjA2LTE4IDE4LTE4IDE4IDguMDYgMTggMTh6IiBzdHJva2U9IiNmYWY4ZjUiIHN0cm9rZS1vcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-10" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="h-16 w-16 text-white mx-auto mb-8 animate-pulse" />
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
            Ready to Start Blogging?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join CoBlog today and turn your ideas into beautiful, engaging
            stories that inspire and connect with readers worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="xl"
              className="bg-white text-royal-900 hover:bg-royal-50 shadow-2xl hover:scale-105 transition-all text-lg px-8"
            >
              <Link href="/dashboard">
                <Pen className="mr-2 h-5 w-5" />
                Start Blogging Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="xl"
              className="border-2 border-white text-black text-lg px-8"
            >
              <Link href="/blog">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Posts
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-white/70 text-sm">
            No credit card required • Start writing in seconds • Join 5,000+
            writers
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
