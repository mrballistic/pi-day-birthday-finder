import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find Your Birthday in π",
  description:
    "Discover exactly where your birthday hides in the digits of pi. A Pi Day celebration.",
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
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
