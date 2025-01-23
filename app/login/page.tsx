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
    <section className="section u-text-center">
        <p><img src="/logo/logo.png" className="w-70p u-center" /></p>
      <button className="m-4"  onClick={() => signIn("google", { callbackUrl: '/'} )}>Sign in with Google</button>
      </section>
  )
}
