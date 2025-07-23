// src/types/next-auth.d.ts
    // Este archivo extiende los tipos predeterminados de NextAuth para incluir
    // las propiedades personalizadas 'id' e 'isCreator' en la sesión y el token JWT.

    import NextAuth, { DefaultSession } from "next-auth";
    import { JWT } from "next-auth/jwt";

    // Declaración para el módulo 'next-auth'
    declare module "next-auth" {
      /**
       * Extiende la interfaz `Session` para incluir propiedades personalizadas.
       * Las propiedades añadidas aquí estarán disponibles en `session.user`.
       */
      interface Session {
        user: {
          id: string; // Añade la propiedad 'id' al usuario de la sesión
          isCreator: boolean; // Añade la propiedad 'isCreator' al usuario de la sesión
        } & DefaultSession["user"]; // Mantiene las propiedades predeterminadas de DefaultSession["user"]
      }

      /**
       * Extiende la interfaz `User` para incluir propiedades personalizadas.
       * Esta interfaz se usa cuando NextAuth carga los datos del usuario.
       */
      interface User {
        id: string; // Añade la propiedad 'id' al tipo User
        isCreator: boolean; // Añade la propiedad 'isCreator' al tipo User
      }
    }

    // Declaración para el módulo 'next-auth/jwt'
    declare module "next-auth/jwt" {
      /**
       * Extiende la interfaz `JWT` para incluir propiedades personalizadas
       * que se almacenan en el token JWT.
       */
      interface JWT {
        id: string; // Añade la propiedad 'id' al token JWT
        isCreator: boolean; // Añade la propiedad 'isCreator' al token JWT
      }
    }
    
