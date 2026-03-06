import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Progress Hub",
  description: "Internal web tool untuk daily coding report",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
