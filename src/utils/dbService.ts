import { Pool } from 'pg';

let pool: Pool;

try {
  // Intentar inicializar el pool de la base de datos
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  console.log('Database pool initialized successfully.');

  // Opcional: Probar la conexión inmediatamente
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    // Aquí podrías implementar lógica para reintentar la conexión o notificar
  });

} catch (error: any) {
  // Capturar cualquier error durante la inicialización del pool
  console.error('Failed to initialize database pool:', error);
  if (error instanceof Error) {
    console.error('Database connection error message:', error.message);
    console.error('Database connection error stack:', error.stack);
  }
  // No re-lanzar aquí para que la aplicación pueda intentar manejarlo,
  // pero las funciones que usen 'query' fallarán si el pool no está listo.
}

export async function query(text: string, params?: any[]) {
  if (!pool) {
    console.error('Database pool is not initialized. Cannot execute query.');
    throw new Error('Database not available.');
  }

  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}
