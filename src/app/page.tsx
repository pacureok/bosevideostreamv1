import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
      <h1 className="text-5xl font-extrabold text-green-400 mb-6 animate-fadeIn">
        Bienvenido a BoseVideoStream
      </h1>
      <p className="text-xl text-gray-300 mb-8 text-center max-w-2xl animate-slideInUp">
        Tu plataforma de streaming de próxima generación. Conéctate con tus creadores favoritos o comparte tu propio contenido.
      </p>

      <div className="flex space-x-6">
        {/* Enlace para que los usuarios normales exploren */}
        <Link href="/explore" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 animate-bounceIn">
          Explorar Streams
        </Link>

        {/* Enlace para que los creadores vayan a su panel */}
        <Link href="/creator/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 animate-bounceIn animation-delay-200">
          Panel de Creador
        </Link>
      </div>

      {/* Animaciones CSS (puedes añadir esto a tu globals.css) */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out 0.3s forwards;
          opacity: 0; /* Asegura que no se vea antes de la animación */
        }

        @keyframes bounceIn {
          from, 20%, 40%, 60%, 80%, to {
            animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
          }
          0% {
            opacity: 0;
            transform: scale3d(0.3, 0.3, 0.3);
          }
          20% {
            transform: scale3d(1.1, 1.1, 1.1);
          }
          40% {
            transform: scale3d(0.9, 0.9, 0.9);
          }
          60% {
            opacity: 1;
            transform: scale3d(1.03, 1.03, 1.03);
          }
          80% {
            transform: scale3d(0.97, 0.97, 0.97);
          }
          to {
            opacity: 1;
            transform: scale3d(1, 1, 1);
          }
        }
        .animate-bounceIn {
          animation: bounceIn 1s ease-out forwards;
          opacity: 0; /* Asegura que no se vea antes de la animación */
        }
        .animate-bounceIn.animation-delay-200 {
          animation-delay: 0.5s; /* Retrasa la segunda animación */
        }
      `}</style>
    </div>
  );
}
