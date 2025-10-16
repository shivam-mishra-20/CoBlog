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
  Feather,
  TrendingUp,
  Zap,
  Shield,
  Search,
  Image as ImageIcon,
  Eye,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: "Rich Text Editor",
      description:
        "Create beautiful, engaging blog posts with our advanced markdown editor with live preview",
    },
    {
      icon: Search,
      title: "Powerful Search",
      description:
        "Find any post instantly with our fast and intelligent search functionality",
    },
    {
      icon: ImageIcon,
      title: "Image Upload",
      description:
        "Add featured images to your posts with our simple drag-and-drop image upload",
    },
    {
      icon: Feather,
      title: "Elegant Design",
      description:
        "A luxurious Royal Brown & White design system with dark mode support",
    },
    {
      icon: BarChart3,
      title: "Post Statistics",
      description:
        "Track word count and reading time for every post automatically",
    },
    {
      icon: Zap,
      title: "Modern Stack",
      description:
        "Built with Next.js 15, tRPC, and PostgreSQL for optimal performance",
    },
    {
      icon: Eye,
      title: "Post Preview",
      description:
        "Preview your posts before publishing to ensure they look perfect",
    },
    {
      icon: Shield,
      title: "SEO Optimized",
      description:
        "Built-in SEO meta tags and structured data for better search rankings",
    },
    {
      icon: TrendingUp,
      title: "Pagination",
      description:
        "Navigate through posts effortlessly with our intuitive pagination system",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-50 via-cream-50 to-brown-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-royal-300/20 dark:bg-royal-700/10 rounded-full blur-3xl" />
          <div className="absolute top-60 -left-40 w-96 h-96 bg-brown-300/15 dark:bg-brown-700/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center mb-6">
              <Sparkles className="h-12 w-12 text-royal-600 dark:text-royal-400" />
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-royal-900 dark:text-royal-100 mb-6 animate-slide-up">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-royal-700 via-royal-600 to-brown-700 dark:from-royal-400 dark:via-royal-300 dark:to-brown-400 bg-clip-text text-transparent">
                CoBlog
              </span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-royal-700 dark:text-royal-300 font-light leading-relaxed">
              A luxurious blogging platform where elegance meets functionality.
              Crafted with care, designed for impact.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild variant="luxury" size="xl">
                <Link href="/blog">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Articles
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-royal-900 dark:text-royal-100 mb-4">
              Why Choose CoBlog?
            </h2>
            <p className="text-lg text-royal-700 dark:text-royal-300 max-w-2xl mx-auto">
              Experience blogging reimagined with our premium features and
              elegant design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:scale-105 transition-all duration-300 border-royal-200 dark:border-royal-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-royal-100 to-brown-100 dark:from-royal-800 dark:to-brown-800 flex items-center justify-center mb-4 transition-shadow">
                    <feature.icon className="h-7 w-7 text-royal-700 dark:text-royal-300" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-royal-800 via-royal-700 to-brown-800 dark:from-royal-900 dark:via-royal-800 dark:to-brown-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwIDkuOTQtOC4wNiAxOC0xOCAxOHMtMTgtOC4wNi0xOC0xOCA4LjA2LTE4IDE4LTE4IDE4IDguMDYgMTggMTh6IiBzdHJva2U9IiNmYWY4ZjUiIHN0cm9rZS1vcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-10" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Start Your Journey Today
          </h2>
          <p className="text-xl text-royal-100 dark:text-royal-200 mb-10 max-w-2xl mx-auto">
            Join our community of writers and readers. Create, share, and
            inspire.
          </p>
          <Button
            asChild
            size="xl"
            className="bg-white text-royal-900 hover:bg-royal-50 dark:bg-royal-100 dark:text-royal-900 dark:hover:bg-white shadow-royal hover:scale-105 transition-transform"
          >
            <Link href="/blog">
              Get Started
              <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
