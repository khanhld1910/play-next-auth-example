import NextAuth, {
  Session as ISession,
  User as IUser,
  JWT as IJWT
} from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User extends IUser {
    accessToken: string
    image: string
    thumb: string
    username: string
  }

  interface JWT extends IJWT {
    accessToken: string
    username: string
  }

  interface Session extends ISession {
    accessToken: string
    username: string
  }
}
