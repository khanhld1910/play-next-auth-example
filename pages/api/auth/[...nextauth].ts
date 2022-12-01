import NextAuth, { JWT, NextAuthOptions, User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import TwitterProvider from 'next-auth/providers/twitter'

// import EmailProvider from "next-auth/providers/email"

type ProviderAuth = {
  provider: string
  access_token: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
      version: '2.0', // opt-in to Twitter OAuth 2.0
      authorization: {
        url: 'https://twitter.com/i/oauth2/authorize',
        params: {
          scope: 'users.read tweet.read tweet.write like.read list.read'
        }
      }
    }),
    CredentialsProvider({
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
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
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
      // console.log('user', JSON.stringify(user, null, 2))
      const { accessToken, username } = user || {}
      const { access_token, provider } = account || {}
      return {
        ...token,
        ...(user && { user }),
        ...(account && { account })
      }
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      // session.accessToken = token.accessToken as string
      // session.username = token.username as string
      return { ...session, huhu: { ...token }, hihi: { ...user } }
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  }
}

export default NextAuth(authOptions)
