// src/app/providers.tsx
    'use client'; // ¡Esto lo marca como un componente de cliente!

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
    
