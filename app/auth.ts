/*
CRUCIAL
https://github.com/nextauthjs/next-auth/discussions/6030
*/

import { AuthOptions, getServerSession} from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const authOptions: AuthOptions = {
    // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: "203882821278-17qcjqtcj8eoidr9hjuor2njjl61019r.apps.googleusercontent.com",
      clientSecret: "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",
    })
  ],
  /*
  HERE
  */
  secret: "KhDvG0yO0/xcIhXQrkRmnLhntE4UzPHlh9mIzUKE2xk="

  /*
GOOGLE_ID=203882821278-17qcjqtcj8eoidr9hjuor2njjl61019r.apps.googleusercontent.com
GOOGLE_SECRET=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

NEXTAUTH_SECRET='KhDvG0yO0/xcIhXQrkRmnLhntE4UzPHlh9mIzUKE2xk='
  */
}

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }