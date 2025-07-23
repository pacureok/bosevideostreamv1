// src/app/register/page.tsx
'use client'; // Componente de cliente

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // Opcional: para iniciar sesión automáticamente después del registro

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Llama a tu API de registro (ruta API de Next.js)
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.message || 'Error al registrar usuario. Inténtalo de nuevo.');
        return;
      }

      setSuccess('¡Registro exitoso! Redirigiendo a la página de inicio de sesión...');
      // Opcional: Iniciar sesión automáticamente después del registro
      // const signInResult = await signIn('credentials', {
      //   redirect: false,
      //   username,
      //   password,
      // });
      // if (signInResult?.error) {
      //   console.error('Error al iniciar sesión automáticamente:', signInResult.error);
      // }

      router.push('/login'); // Redirige a la página de inicio de sesión
    } catch (err) {
      console.error('Error en el registro:', err);
      setError('Error de red o del servidor. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">Registrarse</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-300 text-sm font-bold mb-2">Usuario:</label>
          <input
            type="text"
            id="username"
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 border-gray-600 placeholder-gray-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Elige un nombre de usuario"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 border-gray-600 placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@ejemplo.com"
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
            placeholder="Crea una contraseña segura"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Registrarse
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="text-green-400 hover:underline font-bold">Inicia sesión aquí</a>
        </p>
      </form>
    </div>
  );
}
