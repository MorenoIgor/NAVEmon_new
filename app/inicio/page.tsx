"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { useState,useEffect } from "react"
import { getUserData } from "../databasefunctions"

export default function Inicio() {

    const router = useRouter()
    const {data: session,status} = useSession()

    const [playerInfo, setPlayerInfo] = useState({})

    if (status!="authenticated") {
        return (
            <h1>Acesso restrito</h1>
        )
    }

    useEffect(
            () => {
                async function getPlayerInfo() {
                    let data = await getUserData(session?.user.email)
                    setPlayerInfo(data)
                }
                getPlayerInfo()
            }
        ,[])

    return (
        <section className="section">
        <h1>{session?.user.name}</h1>
        <div className="content">
        <figure className="avatar avatar--xl"><img src={session?.user.image} /></figure>
        </div>
        <button className="btn--lg" style={{margin: "10pt"}} onClick={() => signOut({ callbackUrl: '/'})}>Deslogar</button>

        <button className="btn--lg" style={{margin: "10pt"}} onClick={() => router.push("/lista")}>Meus NAVEMon</button>
        <button className="btn--lg" style={{margin: "10pt"}} onClick={() => router.push("/capturar")}>Capturar NAVEMon</button>
        <button className="btn--lg" style={{margin: "10pt"}} onClick={() => router.push("/desafios")}>Desafios</button>

        <p>
            <b>Curso: </b>{playerInfo.course == "MULT" ? "MULTIMÍDIA" : "PROGRAMAÇÃO"}<br />
            <b>Série: </b>{playerInfo.year}<br />
        </p>

        </section>
    )

}