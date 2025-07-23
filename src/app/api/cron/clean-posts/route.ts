import { NextResponse } from 'next/server';
import { query } from '@/utils/dbService'; // ¡IMPORTACIÓN CORREGIDA CON ALIAS!

export async function GET(req: Request) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const res = await query("DELETE FROM creator_posts WHERE created_at < $1", [thirtyDaysAgo]);
    console.log(`Eliminados ${res.rowCount} publicaciones antiguas.`);

    return NextResponse.json({ message: `Eliminados ${res.rowCount} publicaciones antiguas.` });
  } catch (error) {
    console.error('Error al limpiar publicaciones antiguas:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
