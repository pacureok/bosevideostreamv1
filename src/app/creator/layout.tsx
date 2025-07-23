// src/app/creator/layout.tsx
'use client'; // This marks the component as a Client Component

import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react"; // Import useCallback
import jwt_decode from 'jwt-decode';
import Link from 'next/link'; // Import the Link component

// Define an interface for the decoded JWT data
interface DecodedToken {
  id: string;
  username: string;
  isCreator: boolean; // This property is expected from the JWT
  exp: number; // Token expiration (Unix timestamp)
}

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // useCallback to memoize the authentication check function
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('jwt_token');

    if (token) {
      try {
        const decoded = jwt_decode<DecodedToken>(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        if (decoded.exp < currentTime) {
          // Token expired
          console.log("JWT token expired.");
          localStorage.removeItem('jwt_token');
          setIsAuthenticated(false);
          setIsCreator(false);
        } else {
          // Valid token
          setIsAuthenticated(true);
          setIsCreator(decoded.isCreator); // Use the isCreator property from the token
        }
      } catch (error) {
        // Error decoding the token (invalid or corrupt token)
        console.error("Error decoding JWT token:", error);
        localStorage.removeItem('jwt_token');
        setIsAuthenticated(false);
        setIsCreator(false);
      }
    } else {
      // No token, not authenticated
      setIsAuthenticated(false);
      setIsCreator(false);
    }
    setIsLoading(false); // Authentication check finished
  }, []); // No dependencies, so it's created once

  useEffect(() => {
    checkAuth(); // Run authentication check on component mount

    // Listen for 'storage' events to detect changes in localStorage from other tabs/windows
    window.addEventListener('storage', checkAuth);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [checkAuth]); // Rerun if checkAuth changes (though it's memoized)

  // Effect to redirect once loading is finished and authentication status is clear
  useEffect(() => {
    if (!isLoading) { // Only redirect if loading is finished
      // If not authenticated OR not a creator, redirect to /login
      // Also prevent redirection if already on the login page
      if ((!isAuthenticated || !isCreator) && pathname !== "/login") {
        router.push("/login");
      }
    }
  }, [isLoading, isAuthenticated, isCreator, pathname, router]);


  if (isLoading || (!isAuthenticated && !isCreator && pathname !== "/login")) {
    // Show a loader while session is being verified or before redirection
    // Show the loader only if not already on the login page
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
        Cargando autenticación...
      </div>
    );
  }

  // If authenticated AND is a creator, render the content
  if (isAuthenticated && isCreator) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
        <header className="bg-gray-800 p-4 shadow-md">
          <h1 className="text-3xl font-bold text-green-400">Panel del Creador</h1>
          <nav className="mt-2">
            <ul className="flex gap-4">
              {/* Use Link component for internal navigation */}
              <li><Link href="/creator/dashboard" className="text-green-300 hover:underline">Dashboard</Link></li>
              <li><Link href="/creator/live-studio" className="text-green-300 hover:underline">Estudio en Vivo</Link></li>
              <li><Link href="/creator/publications" className="text-green-300 hover:underline">Mis Publicaciones</Link></li>
            </ul>
          </nav>
        </header>
        <main className="flex-grow p-4">
          {children}
        </main>
        <footer className="bg-gray-800 p-4 text-center text-gray-400 text-sm mt-auto">
          &copy; {new Date().getFullYear()} BoseVideoStream - Panel del Creador.
        </footer>
      </div>
    );
  }

  return null; // Don't render anything if conditions are not met and redirection is in progress
}
