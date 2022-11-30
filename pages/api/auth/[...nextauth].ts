import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { Interface } from 'readline'
// import TwitterProvider from 'next-auth/providers/twitter'
// import EmailProvider from "next-auth/providers/email"

export const authOptions: NextAuthOptions = {
  providers: [
    // TwitterProvider({
    //   clientId: process.env.TWITTER_ID,
    //   clientSecret: process.env.TWITTER_SECRET
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],
  theme: {
    colorScheme: 'light'
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider
        token.accessToken = account?.access_token
      }

      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken as string
      return session
    }
  }
}

export default NextAuth(authOptions)
