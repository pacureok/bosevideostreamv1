// src/app/creator/layout.tsx
'use client'; // ¡ESTO ES ABSOLUTAMENTE CRÍTICO Y DEBE SER LA PRIMERA LÍNEA!

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import jwt_decode from 'jwt-decode'; // Necesitarás instalar 'jwt-decode' (npm install jwt-decode)

// Define una interfaz para los datos decodificados del JWT
interface DecodedToken {
  id: string;
  username: string;
  isCreator: boolean; // Esta propiedad es la que esperamos del JWT
  exp: number; // Expiración del token (Unix timestamp)
}

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('jwt_token');

      if (token) {
        try {
          // Decodifica el token para obtener los datos del usuario
          const decoded = jwt_decode<DecodedToken>(token);
          const currentTime = Date.now() / 1000; // Tiempo actual en segundos

          if (decoded.exp < currentTime) {
            // Token expirado
            console.log("Token JWT expirado.");
            localStorage.removeItem('jwt_token');
            setIsAuthenticated(false);
            setIsCreator(false);
          } else {
            // Token válido
            setIsAuthenticated(true);
            setIsCreator(decoded.isCreator); // Usa la propiedad isCreator del token
          }
        } catch (error) {
          // Error al decodificar el token (token inválido o corrupto)
          console.error("Error al decodificar el token JWT:", error);
          localStorage.removeItem('jwt_token');
          setIsAuthenticated(false);
          setIsCreator(false);
        }
      } else {
        // No hay token, no autenticado
        setIsAuthenticated(false);
        setIsCreator(false);
      }
      setIsLoading(false); // La verificación ha terminado
    };

    checkAuth(); // Ejecuta la verificación al montar el componente
    // Puedes añadir un temporizador para re-verificar periódicamente si lo necesitas
  }, []); // Se ejecuta solo una vez al montar

  // Efecto para redirigir una vez que la carga termina y el estado de autenticación es claro
  useEffect(() => {
    if (!isLoading) { // Solo redirige si ya terminamos de cargar
      // Si no está autenticado O no es creador, redirige a /login
      // También evita la redirección si ya estamos en la página de login
      // CAMBIO AQUÍ: router.pathname A router.asPath
      if ((!isAuthenticated || !isCreator) && router.asPath !== "/login") {
        router.push("/login");
      }
    }
  }, [isLoading, isAuthenticated, isCreator, router]);


  if (isLoading || (!isAuthenticated && !isCreator && router.asPath !== "/login")) {
    // Muestra un loader mientras se verifica la sesión o antes de la redirección
    // Muestra el loader solo si no estamos ya en la página de login
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
        Cargando autenticación...
      </div>
    );
  }

  // Si está autenticado Y es creador, renderiza el contenido
  if (isAuthenticated && isCreator) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
        <header className="bg-gray-800 p-4 shadow-md">
          <h1 className="text-3xl font-bold text-green-400">Panel del Creador</h1>
          <nav className="mt-2">
            <ul className="flex gap-4">
              <li><a href="/creator/dashboard" className="text-green-300 hover:underline">Dashboard</a></li>
              <li><a href="/creator/live-studio" className="text-green-300 hover:underline">Estudio en Vivo</a></li>
              <li><a href="/creator/publications" className="text-green-300 hover:underline">Mis Publicaciones</a></li>
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

  return null; // No renderizar nada si no cumple las condiciones y está en proceso de redirección
}
