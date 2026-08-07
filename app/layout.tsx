import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://navant.dev"),
  title: "Distributed Systems Simplified",
  description: "Clear visual mental models for the distributed systems that run the world.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Distributed Systems Simplified",
    description: "Distributed systems, finally made simple.",
    url: "https://navant.dev",
    siteName: "Distributed Systems Simplified",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Distributed Systems Simplified" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Distributed Systems Simplified", description: "Distributed systems, finally made simple.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
