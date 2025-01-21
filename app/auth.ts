/*
CRUCIAL
https://github.com/nextauthjs/next-auth/discussions/6030
*/

import { AuthOptions, getServerSession} from "next-auth"
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google"

const authOptions: AuthOptions = {
    // Configure one or more authentication providers
  providers: [
        GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    })
  ],
  /*
  HERE
  */
  secret: process.env.NEXTAUTH_SECRET
}

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }