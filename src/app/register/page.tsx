// src/app/
'use client'; // Marca este componente como un componente de cliente

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  // Estados para los campos del formulario y mensajes de error/éxito
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter(); // Hook para la navegación

  // Manejador de envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    setError(''); // Limpia errores anteriores
    setSuccess(''); // Limpia mensajes de éxito anteriores

    try {
      // Realiza una solicitud POST a tu API de registro
      // Netlify redirigirá '/api/register' a tu función Lambda 'netlify/functions/register.ts'
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }), // Envía los datos en formato JSON
      });

      if (!response.ok) {
        // Si la respuesta no es exitosa (ej. 400, 409, 500)
        const errData = await response.json();
        setError(errData.message || 'Error al registrar usuario. Inténtalo de nuevo.');
        return;
      }

      // Si la respuesta es exitosa
      setSuccess('¡Registro exitoso! Redirigiendo a la página de inicio de sesión...');
      // Redirige al usuario a la página de inicio de sesión después de un breve retraso
      router.push('/login');
    } catch (err) {
      // Captura cualquier error de red o del servidor
      console.error('Error en el registro:', err);
      setError('Error de red o del servidor. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">Registrarse</h2>

        {/* Muestra mensajes de error o éxito */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        {/* Campo de Nombre de Usuario */}
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

        {/* Campo de Correo Electrónico */}
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

        {/* Campo de Contraseña */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">Contraseña:</label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-900 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 border-gray-600 placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crea una contraseña segura"
            required
          />
        </div>

        {/* Botón de Registro */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Registrarse
          </button>
        </div>

        {/* Enlace a la página de inicio de sesión */}
        <p className="text-center text-gray-400 text-sm mt-6">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="text-green-400 hover:underline font-bold">Inicia sesión aquí</a>
        </p>
      </form>
    </div>
  );
}
