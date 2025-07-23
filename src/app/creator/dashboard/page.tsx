// src/app/creator/dashboard/page.tsx
import React from 'react';
import Link from 'next/link';

// ESTE ES UN SERVER COMPONENT PURO.
// NO DEBE TENER 'use client' EN LA PRIMERA LÍNEA.
// NO DEBE USAR HOOKS DE REACT COMO useState, useEffect, useSession, etc.
// La autenticación y redirección para proteger esta ruta se maneja en src/app/creator/layout.tsx.

export default function CreatorDashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-900 text-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold text-green-400 mb-6">
        Bienvenido al Dashboard del Creador
      </h2>
      <p className="text-lg text-gray-300 mb-8 text-center max-w-xl">
        Aquí puedes gestionar tus transmisiones, ver estadísticas y acceder a las herramientas de tu estudio.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Tarjeta: Iniciar nueva transmisión */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-semibold text-blue-400 mb-3">Iniciar Transmisión</h3>
          <p className="text-gray-400 mb-4">
            Comienza una nueva transmisión en vivo para tu audiencia.
          </p>
          <Link href="/creator/live-studio" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg inline-block transition duration-300">
            Ir al Estudio
          </Link>
        </div>

        {/* Tarjeta: Ver publicaciones */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-semibold text-purple-400 mb-3">Mis Publicaciones</h3>
          <p className="text-gray-400 mb-4">
            Gestiona tus videos subidos y otras publicaciones.
          </p>
          <Link href="/creator/publications" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg inline-block transition duration-300">
            Ver Publicaciones
          </Link>
        </div>

        {/* Tarjeta: Estadísticas */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-semibold text-yellow-400 mb-3">Estadísticas</h3>
          <p className="text-gray-400 mb-4">
            Revisa el rendimiento de tus transmisiones y audiencia.
          </p>
          <Link href="/creator/stats" className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg inline-block transition duration-300">
            Ver Estadísticas
          </Link>
        </div>
      </div>
    </div>
  );
}
 
