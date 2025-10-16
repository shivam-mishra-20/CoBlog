import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc/client";
import LenisProvider from "@/components/LenisProvider";
import { ToastProvider } from "@/components/ToastProvider";

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
  icons: {
    // provide an object with explicit size to increase icon size (e.g. 512x512)
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
    <html lang="en" className="lenis">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <LenisProvider>
          <TRPCProvider>
            {children}
            <ToastProvider />
          </TRPCProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
