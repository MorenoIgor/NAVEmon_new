"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { useState,useEffect } from "react"
import { getUserData } from "../databasefunctions"
import { Loading } from "../components/loading"

export default function Inicio() {

    const router = useRouter()
    const {data: session,status} = useSession()

    const [playerInfo, setPlayerInfo] = useState({})
    const [loading, setLoading] = useState(true)

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
                    setLoading(false)
                }
                getPlayerInfo()
            }
        ,[])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <section className="section">
        <h1>{session?.user.name}</h1>
        <div className="content">
        <figure className="avatar avatar--xl"><img src={session?.user.image} /></figure>
        </div>
        <button className="m-4"  className="btn--lg" style={{margin: "10pt"}} onClick={() => signOut({ callbackUrl: '/'})}>Deslogar</button>

        <button className="m-4"  className="btn--lg" style={{margin: "10pt"}} onClick={() => router.push("/lista")}>Meus NAVEMon</button>
        <button className="m-4"  className="btn--lg" style={{margin: "10pt"}} onClick={() => router.push("/capturar")}>Capturar NAVEMon</button>
        <button className="m-4"  className="btn--lg" style={{margin: "10pt"}} onClick={() => router.push("/desafios")}>Desafios</button>

        <p>
            <b>Curso: </b>{playerInfo.course == "MULT" ? "MULTIMÍDIA" : "PROGRAMAÇÃO"}<br />
            <b>Série: </b>{playerInfo.year}<br />
        </p>

        </section>
    )

}