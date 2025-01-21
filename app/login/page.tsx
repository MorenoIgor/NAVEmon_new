"use client"

import { signIn, signOut } from "next-auth/react"

import { useSession } from "next-auth/react";

export default function Home() {

    const {data: session, status} = useSession()
      
    return (
    <NoAuth session={session} />
    )
}

function NoAuth(session: object) {
  return (
      <div>
      <button onClick={() => signIn("google", { callbackUrl: '/'} )}>Sign in with Google</button>
      </div>
  )
}
