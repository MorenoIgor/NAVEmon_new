"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { getUserMonsters } from "../databasefunctions"
//import { getNAVEmon} from "../navemonfunctions"
import { NAVEmon } from "@/data/navemon"
import {WildMonsterStats} from "../components/monsterstats"

export default function Lista() {

    const {data: session,status} = useSession()
    const [monsterList, setMonsterList] = useState([])

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
                let data = await getUserMonsters(session?.user.email)
                buildMonsterList(data.monsters.split(","))
            }
            getMon()
        }
    ,[])

    return (
        <div>

          <div id="monsterListContainer">
          {
            monsterList.map(
                (mon) => (
                    <WildMonsterStats key={Date.now()+Math.random()*65535} 
                    monsterdata = {
                        mon
                    } 
                    current = {false}
                    />
                )
            )
          }
          </div>
        </div>
    )

}


