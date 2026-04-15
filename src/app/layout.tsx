import type { Metadata } from "next";
import { AimlverseProvider } from "@/components/providers/aimlverse-provider";
import { MentorWidget } from "@/components/mentor/mentor-widget";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIMLverse | Learn AI by Playing, Practicing & Exploring",
  description:
    "AIMLverse is a futuristic AI/ML learning competition platform for modules, challenges, progress tracking, and hands-on practice.",
  keywords: ["AI learning", "machine learning", "hackathon", "quiz", "AIMLverse"],
  authors: [{ name: "AIMLverse Team" }]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AimlverseProvider>
          {children}
          <MentorWidget />
        </AimlverseProvider>
      </body>
    </html>
  );
}
