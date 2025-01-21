"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"

export default function Inicio() {

    const router = useRouter()
    const {data: session,status} = useSession()

    if (status!="authenticated") {
        return (
            <h1>Acesso restrito</h1>
        )
    }

    return (
        <div>
        <h1>{session?.user.name}</h1>
        <img src={session?.user.image} /> <br />
        <button onClick={() => signOut({ callbackUrl: '/'})}>Deslogar</button>

        <button onClick={() => router.push("/lista")}>Meus NAVEMon</button>
        <button onClick={() => router.push("/capturar")}>Capturar NAVEMon</button>
        <button onClick={() => router.push("/desafios")}>Desafios</button>

        </div>
    )

}