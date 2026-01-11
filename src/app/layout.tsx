import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "[PROJECT_NAME] - Collective Real Estate Ownership",
  description:
    "Own property together with a structured, transparent platform that makes co-ownership easy. Pool resources, share ownership, and build wealth as a community.",
};

// Note: Root layout with edge runtime may have compatibility issues
// Removing edge runtime from root layout to ensure it works
// Individual pages can still use edge runtime if needed
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans antialiased dark:bg-slate-900">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
