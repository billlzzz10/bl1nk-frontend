import NextAuth, { type DefaultSession } from 'next-auth'
import { type DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    appToken?: string
    user: DefaultSession['user'] & Record<string, unknown>
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    appToken?: string
    appUser?: Record<string, unknown>
  }
}
