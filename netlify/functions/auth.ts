// netlify/functions/auth.ts
import { Handler } from '@netlify/functions'; // Importa el tipo Handler de Netlify Functions
import { comparePassword } from '../../src/utils/authService'; // Ruta corregida
import { query } from '../../src/utils/dbService';     // Ruta corregida
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

// Define la función handler para Netlify Lambda
export const handler: Handler = async (event) => {
  console.log('Auth function invoked!'); // Log de inicio

  // Solo permitimos solicitudes POST para el inicio de sesión
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no permitido' }),
    };
  }

  try {
    // Parsear el cuerpo de la solicitud (viene como string en event.body)
    const { username, password } = JSON.parse(event.body || '{}');

    if (!username || !password) {
      console.log('Missing username or password.');
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Username y password requeridos' }),
      };
    }

    console.log(`Attempting login for user: ${username}`);

    // Consulta la base de datos para encontrar al usuario por su nombre de usuario.
    const userRes = await query("SELECT id, username, password, is_creator FROM users WHERE username = $1", [username]);
    const user = userRes.rows[0];

    // Verifica si el usuario existe y si la contraseña es correcta.
    if (!user || !(await comparePassword(password, user.password))) {
      console.log('Invalid credentials.');
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Credenciales incorrectas' }),
      };
    }

    // Genera un JSON Web Token (JWT) con la información del usuario.
    const token = jwt.sign(
      { id: user.id, username: user.username, isCreator: user.is_creator },
      JWT_SECRET,
      { expiresIn: '7d' } // El token expirará en 7 días
    );

    console.log('Login successful, JWT issued.');
    // Devuelve el token en el cuerpo de la respuesta.
    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error: any) {
    console.error('Error autenticando usuario:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor.' }),
    };
  }
};
