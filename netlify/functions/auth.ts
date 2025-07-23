// netlify/functions/auth.ts
    // Este archivo maneja la lógica de inicio de sesión para Netlify Functions.
    // NO es una ruta API de Next.js, sino una función Lambda que maneja el login y genera un JWT.

    import { comparePassword } from "../../src/utils/authService"; // Ruta relativa a authService
    import { query } from "../../src/utils/dbService";     // Ruta relativa a dbService
    import jwt from 'jsonwebtoken'; // Necesitarás instalar 'jsonwebtoken' (npm install jsonwebtoken)

    // ¡IMPORTANTE! Define esta variable de entorno en Netlify.
    // Debe ser una cadena larga y aleatoria para firmar tus JWTs.
    const JWT_SECRET = process.env.JWT_SECRET!;

    export async function handler(event: any) {
      // Solo permitimos solicitudes POST para el inicio de sesión
      if (event.httpMethod !== 'POST') {
        return {
          statusCode: 405,
          body: JSON.stringify({ message: 'Método no permitido' }),
        };
      }

      try {
        const { username, password } = JSON.parse(event.body || '{}');
        if (!username || !password) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Username y password requeridos' }),
          };
        }

        // Consulta la base de datos para encontrar al usuario por su nombre de usuario.
        const userRes = await query("SELECT id, username, password, is_creator FROM users WHERE username = $1", [username]);
        const user = userRes.rows[0];

        // Verifica si el usuario existe y si la contraseña es correcta.
        if (!user || !(await comparePassword(password, user.password))) {
          return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Credenciales incorrectas' }),
          };
        }

        // Genera un JSON Web Token (JWT) con la información del usuario.
        // Este token será enviado al cliente y usado para autenticar futuras solicitudes.
        const token = jwt.sign(
          { id: user.id, username: user.username, isCreator: user.is_creator },
          JWT_SECRET,
          { expiresIn: '7d' } // El token expirará en 7 días
        );

        // Devuelve el token en el cuerpo de la respuesta.
        return {
          statusCode: 200,
          body: JSON.stringify({ token }),
          headers: {
            'Content-Type': 'application/json'
          }
        };
      } catch (error) {
        console.error('Error autenticando usuario:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Error interno del servidor.' }),
        };
      }
    }
    
