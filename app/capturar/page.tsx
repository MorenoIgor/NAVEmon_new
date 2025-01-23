"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { getUserData } from "../databasefunctions"
//import { getNAVEmon} from "../navemonfunctions"
import { NAVEmon } from "@/data/navemon"
import {WildMonsterStats} from "../components/monsterstats"
import {Loading} from "../components/loading"
import { useRouter } from "next/navigation"

export default function Lista() {

    const {data: session,status} = useSession()
    const [monsterList, setMonsterList] = useState([])
    const [playerInfo, setPlayerInfo] = useState({})
    const [errorMessage, setErrorMesage] = useState("")
    const [canCatch, setCanCatch] = useState(true)

    const [loading, setLoading] = useState(true)

    const router = useRouter()

    if (status!="authenticated") {
        return (
            <h1>Acesso restrito</h1>
        )
    }

    function buildMonsterList(lst) {

        let _list = []
        for (let n of NAVEmon.slice(1)) {
            if (!lst.includes(n.id)) {
                _list.push(n)
            }
        }
        
        setMonsterList(_list)
    }

    useEffect(
        () => {
            async function getMon() {
                let data = await getUserData(session?.user.email)
                buildMonsterList(data.monsters.split(","))
                setPlayerInfo(data)

                if (parseInt(data.catches)>0) {
                    setCanCatch(true)
                } else {
                    setCanCatch(false)
                }
                setLoading(false)
            }
            getMon()
        }
    ,[])

    function noCatches() {
        setErrorMesage("Você não tem capturas suficientes! Volte amanhã!")
    }

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
                    <WildMonsterStats key={Date.now()+Math.random()*65535} 
                    monsterdata = {
                        mon
                    } 
                    current = {false}
                    cancatch = {canCatch}
                    callback = {noCatches}
                    />
                )
            )
          }
          </div>
          <h2>Capturas restantes: {playerInfo.catches}</h2>
          <p>{errorMessage}</p><br />
          <button className="m-4"  onClick={()=>{router.replace("/inicio/")}}>Voltar para Início</button>
        </section>
    )

}


