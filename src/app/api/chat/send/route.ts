import { NextResponse } from 'next/server';
import Pusher from 'pusher';
import jwt from 'jsonwebtoken';
// RUTA CORREGIDA: Subir 3 niveles para llegar a src, luego ir a utils
import { query } from '../../../utils/dbService'; // Assuming dbService is needed here for user info or similar

async function getSessionFromRequest(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string; isCreator: boolean; name: string; username: string; };
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

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });
  }

  try {
    const { message, creatorId } = await request.json();

    if (!message || !creatorId) {
      return NextResponse.json({ message: 'Mensaje y ID de creador son requeridos.' }, { status: 400 });
    }

    await pusher.trigger(`chat-${creatorId}`, 'new-message', {
      message: `${session.user?.name}: ${message}`,
    });

    return NextResponse.json({ message: 'Mensaje enviado.' }, { status: 200 });
  } catch (error) {
    console.error('Error al enviar mensaje de chat:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
