import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find Your Birthday in π — Pi Day Birthday Finder",
  description:
    "Enter your birthday and watch a dramatic scanning animation find it in 5 million digits of pi. Celebrate Pi Day with confetti, trivia, and a shareable result card.",
  keywords: [
    "pi day",
    "birthday in pi",
    "pi digits",
    "pi day 2026",
    "find birthday in pi",
    "pi search",
    "math",
    "pi trivia",
  ],
  authors: [{ name: "Todd Greco" }],
  openGraph: {
    title: "Find Your Birthday in π",
    description:
      "Every birthday is hiding somewhere in the infinite digits of pi. Enter yours and watch as we scan 5 million digits to find it.",
    type: "website",
    locale: "en_US",
    siteName: "Pi Day Birthday Finder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Your Birthday in π",
    description:
      "Every birthday is hiding somewhere in the infinite digits of pi. Enter yours and watch as we scan 5 million digits to find it.",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "theme-color": "#0a0a1a",
  },
};

/**
 * Root layout for the app. Loads Inter and JetBrains Mono fonts via next/font,
 * sets CSS custom property variables on the body, and wraps children in the
 * MUI ThemeRegistry.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Pi Day Birthday Finder",
              description:
                "Enter your birthday and discover where it appears in the first 5 million digits of pi.",
              applicationCategory: "Entertainment",
              operatingSystem: "Web",
              author: {
                "@type": "Person",
                name: "Todd Greco",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <ThemeRegistry>{children}</ThemeRegistry>
        <Analytics />
      </body>
    </html>
  );
}
