// src/app/providers.tsx
'use client'; // ¡ESTO ES ABSOLUTAMENTE CRÍTICO Y DEBE SER LA PRIMERA LÍNEA!

import { SessionProvider } from "next-auth/react";
import React from "react"; // Necesario para JSX

// Este componente envuelve a los hijos con SessionProvider
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

    
