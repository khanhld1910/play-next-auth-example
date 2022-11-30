import NextAuth, { JWT, NextAuthOptions, User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { AdapterUser } from 'next-auth/adapters'

// import TwitterProvider from 'next-auth/providers/twitter'
// import EmailProvider from "next-auth/providers/email"

type AuthInfo = {
  id: number
  token: string
  username: string
  email: string
}

const cohartCredentialsProvider = CredentialsProvider({
  id: 'cohart-api-login',
  name: 'credentials',
  credentials: {
    phone: { label: 'Phone', type: 'phone', placeholder: '+84123456789' },
    password: { label: 'Password', type: 'password' }
  },
  async authorize(credentials, req) {
    const res = await fetch('https://api.cohdev.co/v1/login', {
      method: 'POST',
      body: JSON.stringify({
        login_with: 'phone',
        number: credentials?.phone,
        country_code: '+84',
        password: credentials?.password
      }),
      headers: { 'Content-Type': 'application/json' }
    })

    const {
      statusCode,
      data: { user, token }
    } = (await res.json()) as {
      statusCode: number
      data: { user: Record<string, unknown>; token: string }
    }

    if (statusCode === 200 && user && token) {
      return {
        accessToken: token,
        id: user.id,
        image: user.cover_image,
        email: user.email,
        username: user.username,
        name: user.full_name
      } as User
    }

    return null // cannot login
  }
})

const googleProvider = GoogleProvider({
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET
})

export const authOptions: NextAuthOptions = {
  providers: [
    // TwitterProvider({
    //   clientId: process.env.TWITTER_ID,
    //   clientSecret: process.env.TWITTER_SECRET
    // }),
    cohartCredentialsProvider,
    googleProvider
  ],
  theme: {
    colorScheme: 'light'
  },
  callbacks: {
    async signIn(params) {
      // console.table(params)
      return true
    },
    async jwt({ token, account, user }) {
      // console.log('account', JSON.stringify(account, null, 2))
      const { accessToken, username } = user || {}
      const a = {
        ...token,
        ...(accessToken && { accessToken }),
        ...(username && { username })
      }
      return a
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken as string
      session.username = token.username as string
      return session
    }
  }
}

export default NextAuth(authOptions)
