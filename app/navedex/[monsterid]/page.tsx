"use client"

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { NAVEmon } from "@/data/navemon";
import { getUserCurrentMonster, setCurrentNAVEmon } from "@/app/databasefunctions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MonsterStats() {

    const {data: session,status} = useSession()
    const monsterid = useParams().monsterid
    const [current, setCurrent] = useState(false)
    const router = useRouter()

    if (status!="authenticated") {
        return (
            <h1>Acesso restrito</h1>
        )
    }

    async function changeMain() {
        let res = await setCurrentNAVEmon(session.user.email,parseInt(monsterid))
        setCurrent(true)
    }

    useEffect(
            () => {
                async function getMonCurrent() {
                    let data = await getUserCurrentMonster(session?.user.email)
                    let cur = (data.currentmonster == parseInt(monsterid))
                    setCurrent(cur)
                    
                }
                getMonCurrent()
            }
        ,[current])

    return (
        <div className="content">
        <h1>{NAVEmon[monsterid].name}{current == true? "⭐" : ""}</h1>
        <img className="u-center" src={`/artwork/${monsterid}.png`}></img><br />
        <button className="m-4"  onClick={()=>changeMain()}>Tornar Principal</button><br />
        <button className="m-4"  onClick={()=>{router.replace("/lista/")}}>Voltar para Lista</button>
        </div>
    )

}