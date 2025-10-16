"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/categories", label: "Categories" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-royal-200 dark:border-royal-800 shadow-royal sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            {/* Logo */}
            <Image
              src="/coblog-logo.png"
              alt="CoBlog Logo"
              width={40}
              height={40}
              className="h-20 w-20 object-fit ml-0"
            />
            {/* Site Title */}
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="md:text-3xl font-serif text-2xl font-bold bg-gradient-to-r from-royal-700 via-royal-600 to-brown-700 dark:from-royal-400 dark:via-royal-300 dark:to-brown-400 bg-clip-text text-transparent">
                CoBlog
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group",
                  isActive(link.href)
                    ? "text-royal-900 dark:text-royal-100"
                    : "text-royal-600 dark:text-royal-400 hover:text-royal-900 dark:hover:text-royal-100"
                )}
              >
                <span className="relative z-10">{link.label}</span>
                {isActive(link.href) && (
                  <span className="absolute inset-0 bg-royal-100 dark:bg-royal-800/40 rounded-lg" />
                )}
                {!isActive(link.href) && (
                  <span className="absolute inset-0 bg-royal-50 dark:bg-royal-800/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-royal-700 dark:text-royal-300 hover:text-royal-900 dark:hover:text-royal-100 hover:bg-royal-100 dark:hover:bg-royal-800/30 transition-all"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <Menu className="h-6 w-6" />
              ) : (
                <X className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-royal-200 dark:border-royal-800 animate-slide-down">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg text-base font-medium transition-all border-l-4",
                  isActive(link.href)
                    ? "bg-royal-100 dark:bg-royal-800/40 border-royal-700 dark:border-royal-400 text-royal-900 dark:text-royal-100"
                    : "border-transparent text-royal-700 dark:text-royal-400 hover:bg-royal-50 dark:hover:bg-royal-800/20 hover:text-royal-900 dark:hover:text-royal-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
