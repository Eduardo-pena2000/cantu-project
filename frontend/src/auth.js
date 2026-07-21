import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { fetchApi } from "./lib";
import { sessionDto } from "./dtos";

class InvalidCredentials extends CredentialsSignin {
  code = "InvalidCredentials";

  constructor() {
    super("Invalid Credentials");
    this.status = 403;
    this.message = "Credenciales incorrectas.";
  }
}

class AuthorizeError extends AuthError {
  code = "AuthError";

  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Correo electrónico", type: "email", required: true },
        password: { label: "Contraseña", type: "password", required: true },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = credentials;

          const res = await fetchApi("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) {
            if (res.status === 401) {
              throw new InvalidCredentials();
            } else {
              throw new AuthorizeError(400, "Ha ocurrido un error.");
            }
          }

          const json = await res.json();

          const { user, access_token, refresh_token } = json.body;
          const session = sessionDto({
            user,
            accessToken: access_token,
            refreshToken: refresh_token,
          });

          return session;
        } catch (error) {
          if (error instanceof InvalidCredentials || error instanceof AuthorizeError) {
            throw error;
          }

          throw new AuthorizeError(
            500,
            "Ha ocurrido un error inesperado, vuelve a intentarlo en otro momento."
          );
        }
      },
    }),
  ],
  jwt: {
    maxAge: 5 * 24 * 60 * 60 - 5 * 60, // 5 days less 5 minutes
  },
  session: {
    strategy: "jwt",
    maxAge: 5 * 24 * 60 * 60 - 5 * 60, // 5 days less 5 minutes
  },
  callbacks: {
    jwt: async ({ trigger, user, token, session }) => {
      // Persist the access token, refresh token, user and store info to the token right after signin
      if (token && user) {
        token.user = user.user;
        token.store = user.store;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.hasDeviceToken = user.hasDeviceToken;
      }

      if (trigger === "update") {
        if (session?.store) {
          token.store = {
            id: session.store.id,
            name: session.store.name,
            code: session.store.code,
          };
        } else {
          token.store = null;
        }
      }

      return token;
    },
    session: async ({ session, token }) => {
      // Send properties to the client, access token, refresh token, user and store info from a provider.
      session.user = token.user;
      session.store = token.store;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.hasDeviceToken = token.hasDeviceToken;

      if (token?.store) {
        session.store = {
          id: token.store.id,
          name: token.store.name,
          code: token.store.code,
        };
      }

      return session;
    },
    authorized: async ({ auth }) => {
      // Return true if the user is authenticated, otherwise false which triggers a redirect to signIn page.
      return !!auth;
    },
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
});
