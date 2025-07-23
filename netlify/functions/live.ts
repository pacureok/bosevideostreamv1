// netlify/functions/live.ts
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
    console.error("Error validating JWT in live function:", error);
    return null;
  }
}

export async function handler(event: any) {
  const method = event.httpMethod;

  // POST - actualizar estado en vivo
  if (method === "POST") {
    const session = await getSessionFromRequest(event);
    if (!session || !session.user?.isCreator) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'No autorizado.' })
      };
    }

    try {
      const { status, youtubeUrl } = JSON.parse(event.body || '{}');
      const userId = session.user?.id;

      if (!userId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'ID de usuario no encontrado en la sesión.' })
        };
      }

      await query(
        "UPDATE users SET is_live = $1, youtube_url = COALESCE($2, youtube_url) WHERE id = $3",
        [status, youtubeUrl, userId]
      );

      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Estado de transmisión actualizado a ${status ? 'EN VIVO' : 'FUERA DE LÍNEA'}.` })
      };
    } catch (error) {
      console.error('Error al actualizar estado de live:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error interno del servidor.' })
      };
    }
  }

  // GET - obtener creadores en vivo
  if (method === "GET") {
    try {
      const liveCreators = await query("SELECT id, username, youtube_url FROM users WHERE is_live = TRUE");
      return {
        statusCode: 200,
        body: JSON.stringify(liveCreators.rows)
      };
    } catch (error) {
      console.error('Error al obtener creadores en vivo:', error);
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
