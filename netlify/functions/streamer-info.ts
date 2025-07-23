// netlify/functions/streamer-info.ts
import { query } from '../../src/utils/dbService'; // Ruta relativa a dbService
import jwt from 'jsonwebtoken'; // Necesario para verificar JWT

// Helper: Implementa esto para verificar el JWT del cliente
async function getSessionFromRequest(event: any) {
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string; isCreator: boolean; name: string; };
    return { user: { id: decoded.id, isCreator: decoded.isCreator, name: decoded.name } };
  } catch (error) {
    console.error("Error validating JWT in streamer-info function:", error);
    return null;
  }
}

export async function handler(event: any) {
  const method = event.httpMethod;

  // GET - obtener información del streamer
  if (method === "GET") {
    const session = await getSessionFromRequest(event);
    if (!session) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'No autenticado.' })
      };
    }

    try {
      const userId = session.user?.id;
      if (!userId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'ID de usuario no encontrado en la sesión.' })
        };
      }

      const userRes = await query("SELECT username, email, is_creator, youtube_url, is_live FROM users WHERE id = $1", [userId]);
      const user = userRes.rows[0];

      if (!user) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Usuario no encontrado.' })
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(user)
      };
    } catch (error) {
      console.error('Error al obtener información del streamer:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error interno del servidor.' })
      };
    }
  }

  // PUT - actualizar información del streamer
  if (method === "PUT") {
    const session = await getSessionFromRequest(event);
    if (!session || !session.user?.isCreator) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'No autorizado.' })
      };
    }

    try {
      const { youtubeUrl, isLive } = JSON.parse(event.body || '{}');
      const userId = session.user?.id;

      if (!userId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'ID de usuario no encontrado en la sesión.' })
        };
      }

      const updates: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (youtubeUrl !== undefined) {
        updates.push(`youtube_url = $${paramIndex++}`);
        params.push(youtubeUrl);
      }
      if (isLive !== undefined) {
        updates.push(`is_live = $${paramIndex++}`);
        params.push(isLive);
      }

      if (updates.length === 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'No hay campos para actualizar.' })
        };
      }

      params.push(userId);

      const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`;
      await query(updateQuery, params);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Información del streamer actualizada.' })
      };
    } catch (error) {
      console.error('Error al actualizar información del streamer:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error interno del servidor.' })
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Método no soportado.' })
  };
}
