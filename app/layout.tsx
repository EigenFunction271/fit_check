import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Health & Fitness Research Study Platform",
  description: "Manage research study participants and workout sessions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
