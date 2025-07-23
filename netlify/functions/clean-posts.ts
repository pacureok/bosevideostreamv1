// netlify/functions/clean-posts.ts
import { query } from '../../src/utils/dbService'; // Ruta relativa a dbService

export async function handler(event: any) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no permitido.' }),
    };
  }

  // Opcional: Proteger esta ruta para que solo sea accesible por Netlify Scheduled Functions o una clave secreta.
  // Puedes verificar un encabezado como 'x-netlify-trigger' si usas Scheduled Functions.
  // if (event.headers['x-netlify-trigger'] !== 'true') {
  //   return {
  //     statusCode: 401,
  //     body: JSON.stringify({ message: 'No autorizado.' }),
  //   };
  // }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const res = await query("DELETE FROM creator_posts WHERE created_at < $1", [thirtyDaysAgo]);
    console.log(`Eliminados ${res.rowCount} publicaciones antiguas.`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Eliminados ${res.rowCount} publicaciones antiguas.` }),
    };
  } catch (error) {
    console.error('Error al limpiar publicaciones antiguas:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor.' }),
    };
  }
}
