import { NextResponse } from 'next/server';
import { hashPassword } from '../../../utils/authService';
import { query } from '../../../utils/dbService';

export async function POST(request: Request) {
  console.log('Function register invoked!'); // Log de inicio de la función

  try {
    // Log para verificar si las variables de entorno son accesibles
    console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length || 'undefined');
    console.log('Attempting to parse request body...');

    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      console.log('Missing username, email, or password.');
      return NextResponse.json({ message: 'Todos los campos son requeridos.' }, { status: 400 });
    }

    console.log(`Attempting to register user: ${username}, ${email}`);

    const userExists = await query("SELECT id FROM users WHERE username = $1 OR email = $2", [username, email]);
    if (userExists.rows.length > 0) {
      console.log('User or email already registered.');
      return NextResponse.json({ message: 'El usuario o email ya está registrado.' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    console.log('Password hashed successfully.');

    await query(
      "INSERT INTO users (username, email, password, is_creator) VALUES ($1, $2, $3, FALSE)",
      [username, email, hashedPassword]
    );

    console.log('User registered successfully!');
    return NextResponse.json({ message: 'Registro exitoso.' }, { status: 201 });
  } catch (error: any) { // Captura el error para loggearlo
    console.error('Error during registration process:', error);
    // Intenta loggear el mensaje de error si existe
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
