import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book AI Copilot",
  description: "Write, organize, and refine books with an AI copilot."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
