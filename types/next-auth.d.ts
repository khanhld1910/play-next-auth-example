import NextAuth, { Session as ISession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends ISession {
    accessToken: string
  }
}
