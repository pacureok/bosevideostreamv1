import bcrypt from 'bcrypt';

// Función para hashear la contraseña
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Función para comparar contraseñas
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
