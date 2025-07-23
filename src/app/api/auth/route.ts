import { NextResponse } from 'next/server';
// RUTA CORREGIDA: Subir 3 niveles para llegar a src, luego ir a utils
import { comparePassword } from '../../../utils/authService';
import { query } from '../../../utils/dbService';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Username y password requeridos' }, { status: 400 });
    }

    const userRes = await query("SELECT id, username, password, is_creator FROM users WHERE username = $1", [username]);
    const user = userRes.rows[0];

    if (!user || !(await comparePassword(password, user.password))) {
      return NextResponse.json({ message: 'Credenciales incorrectas' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, isCreator: user.is_creator },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Error autenticando usuario:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
 
