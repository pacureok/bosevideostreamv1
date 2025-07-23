// netlify/functions/send-chat.ts
import { Handler } from '@netlify/functions';
import Pusher from 'pusher';
import jwt from 'jsonwebtoken';

// Helper para verificar el JWT del cliente en un evento de Netlify Function
async function getSessionFromEvent(event: any) {
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string; isCreator: boolean; username: string; }; // Asume 'username' en el token
    return { user: { id: decoded.id, isCreator: decoded.isCreator, name: decoded.username } };
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

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no soportado.' })
    };
  }

  const session = await getSessionFromEvent(event); // Usa getSessionFromEvent
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
};
