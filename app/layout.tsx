import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClientLayout } from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Neurodiverse Algebra Demo",
  description: "UDL-based algebra learning app for neurodiverse students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Atkinson+Hyperlegible:wght@400;700&family=Lexend:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}