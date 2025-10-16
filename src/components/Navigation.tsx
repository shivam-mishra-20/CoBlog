"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
    <nav className="bg-white/80 backdrop-blur-xl border-b border-royal-200 shadow-royal sticky top-0 z-50">
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
              <span className="md:text-3xl font-serif text-2xl font-bold text-gradient-royal">
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
                    ? "text-royal-800"
                    : "text-royal-600 hover:text-royal-800"
                )}
              >
                <span className="relative z-10">{link.label}</span>
                {isActive(link.href) && (
                  <span className="absolute inset-0 bg-royal-100 rounded-lg" />
                )}
                {!isActive(link.href) && (
                  <span className="absolute inset-0 bg-royal-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-royal-700 hover:text-royal-900 hover:bg-royal-100 transition-all"
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
        <div className="md:hidden bg-white border-t border-royal-200 animate-slide-down">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg text-base font-medium transition-all border-l-4",
                  isActive(link.href)
                    ? "bg-royal-100 border-royal-700 text-royal-900"
                    : "border-transparent text-royal-700 hover:bg-royal-50 hover:text-royal-900"
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
