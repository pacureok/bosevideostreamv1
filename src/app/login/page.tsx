// src/app/login/page.tsx
'use client'; // Componente de cliente

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // Importa signIn de next-auth/react

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Usa signIn de NextAuth.js
    const result = await signIn('credentials', {
      redirect: false, // No redirigir automáticamente, manejamos la redirección manualmente
      username,
      password,
    });

    if (result?.error) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
      console.error('Login error:', result.error);
    } else {
      // Si el inicio de sesión es exitoso, redirige al dashboard del creador
      router.push('/creator/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">Iniciar Sesión</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-300 text-sm font-bold mb-2">Usuario:</label>
          <input
            type="text"
            id="username"
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 border-gray-600 placeholder-gray-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tu nombre de usuario"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">Contraseña:</label>
          <input
            type="password"
            id="password"
            className="p-2 mb-4 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Iniciar Sesión
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          ¿No tienes una cuenta?{' '}
          <a href="/register" className="text-green-400 hover:underline font-bold">Regístrate aquí</a>
        </p>
      </form>
    </div>
  );
}
