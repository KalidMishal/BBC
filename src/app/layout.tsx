import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BBC Home - Breaking News, World News, US News, Sports, Business, Innovation, Climate, Culture, Travel, Video & Audio",
  description: "Visit BBC for breaking news, analysis, features, video and audio from our global team of journalists across the UK and around the world.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
