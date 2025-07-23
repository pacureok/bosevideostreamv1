import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Asegúrate de que tus estilos globales estén aquí
import React from "react"; // Importa React
import Providers from "./providers"; // ¡IMPORTA EL COMPONENTE CLIENTE Providers!

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
        {/* Envuelve toda la aplicación con el componente Providers (que es de cliente) */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
