// netlify/functions/send-chat.ts
import Pusher from 'pusher';
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
    console.error("Error validating JWT in chat function:", error);
    return null;
  }
}

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
  useTLS: true,
});

export async function handler(event: any) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no soportado.' })
    };
  }

  const session = await getSessionFromRequest(event);
  if (!session) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'No autenticado.' })
    };
  }

  try {
    const { message, creatorId } = JSON.parse(event.body || '{}');

    if (!message || !creatorId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Mensaje y ID de creador son requeridos.' })
      };
    }

    await pusher.trigger(`chat-${creatorId}`, 'new-message', {
      message: `${session.user?.name}: ${message}`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Mensaje enviado.' })
    };
  } catch (error) {
    console.error('Error al enviar mensaje de chat:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor.' })
    };
  }
}
