import { NextResponse } from 'next/server';
// RUTA CORREGIDA: Subir 3 niveles para llegar a src, luego ir a utils
import { query } from '../../../utils/dbService';
import jwt from 'jsonwebtoken';

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
    console.error("Error validating JWT in streamer-info function:", error);
    return null;
  }
}

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });
  }

  try {
    const userId = session.user?.id;
    if (!userId) {
      return NextResponse.json({ message: 'ID de usuario no encontrado en la sesión.' }, { status: 400 });
    }

    const userRes = await query("SELECT username, email, is_creator, youtube_url, is_live FROM users WHERE id = $1", [userId]);
    const user = userRes.rows[0];

    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error al obtener información del streamer:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session || !session.user?.isCreator) {
    return NextResponse.json({ message: 'No autorizado.' }, { status: 403 });
  }

  try {
    const { youtubeUrl, isLive } = await request.json();
    const userId = session.user?.id;

    if (!userId) {
      return NextResponse.json({ message: 'ID de usuario no encontrado en la sesión.' }, { status: 400 });
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
      return NextResponse.json({ message: 'No hay campos para actualizar.' }, { status: 400 });
    }

    params.push(userId);

    const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`;
    await query(updateQuery, params);

    return NextResponse.json({ message: 'Información del streamer actualizada.' }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar información del streamer:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
