        import { NextResponse } from 'next/server';
        import { query } from '../../../../src/utils/dbService';
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
            console.error("Error validating JWT in live function:", error);
            return null;
          }
        }

        export async function POST(request: Request) {
          const session = await getSessionFromRequest(request);
          if (!session || !session.user?.isCreator) {
            return NextResponse.json({ message: 'No autorizado.' }, { status: 403 });
          }

          try {
            const { status, youtubeUrl } = await request.json();
            const userId = session.user?.id;

            if (!userId) {
              return NextResponse.json({ message: 'ID de usuario no encontrado en la sesión.' }, { status: 400 });
            }

            await query(
              "UPDATE users SET is_live = $1, youtube_url = COALESCE($2, youtube_url) WHERE id = $3",
              [status, youtubeUrl, userId]
            );

            return NextResponse.json({ message: `Estado de transmisión actualizado a ${status ? 'EN VIVO' : 'FUERA DE LÍNEA'}.` }, { status: 200 });
          } catch (error) {
            console.error('Error al actualizar estado de live:', error);
            return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
          }
        }

        export async function GET(request: Request) {
          try {
            const liveCreators = await query("SELECT id, username, youtube_url FROM users WHERE is_live = TRUE");
            return NextResponse.json(liveCreators.rows, { status: 200 });
          } catch (error) {
            console.error('Error al obtener creadores en vivo:', error);
            return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
          }
        }
        
