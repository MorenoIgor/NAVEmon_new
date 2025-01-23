"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { getUserMonsters } from "../databasefunctions"
//import { getNAVEmon} from "../navemonfunctions"
import { NAVEmon } from "@/data/navemon"
import { useRouter } from "next/navigation"
import {CaughtMonsterStats} from "../components/monsterstats"
import { Loading } from "../components/loading"

export default function Lista() {

    const {data: session,status} = useSession()
    const [monsterList, setMonsterList] = useState([])
    const [currentMonster, setCurrentMonster] = useState(-1)

    const [loading, setLoading] = useState(true)

    const router = useRouter()

    if (status!="authenticated") {
        return (
            <h1>Acesso restrito</h1>
        )
    }

    useEffect(
        () => {
            async function getMon() {
                let data = await getUserMonsters(session?.user.email)
                setMonsterList(data.monsters.split(","))
                setCurrentMonster(data.currentmonster)
                setLoading(false)
                
            }
            getMon()
        }
    ,[])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <section className="section w-90p">

          <div className="grid grid-cols-3 u-gap-2">
          {
            monsterList.map(
                (mon) => (
                    <CaughtMonsterStats key={Date.now()+Math.random()*65535} 
                    monsterdata = {
                        NAVEmon[parseInt(mon)]
                    } 
                    caught = {monsterList.includes(mon)}
                    current = {currentMonster == parseInt(mon)}
                    />
                )
            )
          }
          </div>
          <button className="m-4" onClick={()=>{router.replace("/inicio/")}}>Voltar para Início</button>
        </section>
    )

}


