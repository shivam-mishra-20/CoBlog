import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc/client";
import LenisProvider from "@/components/LenisProvider";
import { ToastProvider } from "@/components/ToastProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CoBlog - Collaborative Blogging Platform",
  description:
    "A collaborative blogging platform with Royal Brown & White design system. Built with Next.js 15, tRPC, and PostgreSQL",
  keywords: [
    "blog",
    "blogging platform",
    "Next.js",
    "tRPC",
    "PostgreSQL",
    "content management",
  ],
  authors: [{ name: "CoBlog Team" }],
  openGraph: {
    title: "CoBlog - Collaborative Blogging Platform",
    description:
      "A collaborative blogging platform with Royal Brown & White design system",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CoBlog - Collaborative Blogging Platform",
    description:
      "A collaborative blogging platform with Royal Brown & White design system",
  },
  icons: {
    icon: [
      {
        url: "/coblog-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="lenis" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <ThemeProvider>
          <LenisProvider>
            <TRPCProvider>
              {children}
              <ToastProvider />
            </TRPCProvider>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
