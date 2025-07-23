// netlify/functions/register.ts
import { hashPassword } from '../../src/utils/authService'; // Ruta relativa a authService
import { query } from '../../src/utils/dbService';     // Ruta relativa a dbService

export async function handler(event: any) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no soportado.' })
    };
  }

  try {
    const { username, email, password } = JSON.parse(event.body || '{}');

    if (!username || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Todos los campos son requeridos.' })
      };
    }

    const userExists = await query("SELECT id FROM users WHERE username = $1 OR email = $2", [username, email]);
    if (userExists.rows.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'El usuario o email ya está registrado.' })
      };
    }

    const hashedPassword = await hashPassword(password);

    await query(
      "INSERT INTO users (username, email, password, is_creator) VALUES ($1, $2, $3, FALSE)",
      [username, email, hashedPassword]
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Registro exitoso.' })
    };
  } catch (error) {
    console.error('Error durante el registro:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor.' })
    };
  }
}
