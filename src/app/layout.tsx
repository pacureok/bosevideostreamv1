import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BoseVideoStream",
  description: "Plataforma de streaming de video y audio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Aquí NO hay SessionProvider ni Providers. Los hijos se renderizan directamente. */}
        {children}
      </body>
    </html>
  );
}
