import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900">
              Welcome to <span className="text-blue-600">CoBlog</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
              A modern blogging platform built with Next.js 15
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <Link
                href="/blog"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Read Blog
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 CoBlog</p>
        </div>
      </footer>
    </div>
  );
}
