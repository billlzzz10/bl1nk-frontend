import NextAuth, { type NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'

const backendBaseUrl =
  process.env.AUTH_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  ''

async function authenticateWithCredentials(email: string, password: string) {
  if (!backendBaseUrl) {
    throw new Error('AUTH_BACKEND_URL is not configured')
  }

  const response = await fetch(`${backendBaseUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'Invalid credentials')
  }

  return response.json()
}

async function exchangeOAuthToken(provider: string, accessToken?: string | null) {
  if (!backendBaseUrl) {
    throw new Error('AUTH_BACKEND_URL is not configured')
  }

  if (!accessToken) {
    throw new Error('Missing provider access token')
  }

  const response = await fetch(`${backendBaseUrl}/auth/oauth/${provider}/exchange`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ access_token: accessToken }),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'OAuth exchange failed')
  }

  return response.json()
}

const config: NextAuthConfig = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials')
        }

        const data = await authenticateWithCredentials(credentials.email, credentials.password)

        if (!data) {
          return null
        }

        return {
          id: data.user?.id ?? data.user?.email ?? credentials.email,
          email: data.user?.email ?? credentials.email,
          name: data.user?.name ?? data.user?.full_name ?? null,
          token: data.token,
          user: data.user,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && 'token' in user) {
        token.appToken = (user as any).token
        token.appUser = (user as any).user ?? {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }

      if (account && account.type === 'oauth') {
        try {
          const data = await exchangeOAuthToken(account.provider, account.access_token)
          token.appToken = data.token
          token.appUser = data.user ?? token.appUser
        } catch (error) {
          console.error('OAuth token exchange failed:', error)
          throw error
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token.appToken) {
        ;(session as any).appToken = token.appToken
      }

      if (token.appUser) {
        session.user = {
          ...(session.user ?? {}),
          ...(token.appUser as Record<string, unknown>),
        }
      }

      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }

      if (new URL(url).origin === baseUrl) {
        return url
      }

      return baseUrl
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
