// netlify/functions/register.ts
import { Handler } from '@netlify/functions'; // Importa el tipo Handler de Netlify Functions
import { hashPassword } from '../../src/utils/authService'; // Ruta corregida
import { query } from '../../src/utils/dbService';     // Ruta corregida

// Define la función handler para Netlify Lambda
export const handler: Handler = async (event) => {
  console.log('Register function invoked!'); // Log de inicio

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no soportado.' })
    };
  }

  try {
    // Parsear el cuerpo de la solicitud
    const { username, email, password } = JSON.parse(event.body || '{}');

    if (!username || !email || !password) {
      console.log('Missing username, email, or password.');
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Todos los campos son requeridos.' })
      };
    }

    console.log(`Attempting to register user: ${username}, ${email}`);

    const userExists = await query("SELECT id FROM users WHERE username = $1 OR email = $2", [username, email]);
    if (userExists.rows.length > 0) {
      console.log('User or email already registered.');
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'El usuario o email ya está registrado.' })
      };
    }

    const hashedPassword = await hashPassword(password);
    console.log('Password hashed successfully.');

    await query(
      "INSERT INTO users (username, email, password, is_creator) VALUES ($1, $2, $3, FALSE)",
      [username, email, hashedPassword]
    );

    console.log('User registered successfully!');
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Registro exitoso.' })
    };
  } catch (error: any) {
    console.error('Error during registration:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor.' })
    };
  }
};
