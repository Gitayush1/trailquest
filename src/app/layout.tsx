import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrailQuest — AI That Wants You to Use Your Phone Less",
  description:
    "TrailQuest turns open AI into real-world adventures — personalized to your time, interests, environment, and surroundings. The screen is the shortest part of the experience.",
  keywords: [
    "outdoor",
    "adventure",
    "AI",
    "open-source",
    "nature",
    "quests",
    "touch grass",
  ],
  openGraph: {
    title: "TrailQuest — AI That Wants You to Use Your Phone Less",
    description:
      "Open-AI powered outdoor micro-adventures. Personalized. Real-world. Screen-free.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
