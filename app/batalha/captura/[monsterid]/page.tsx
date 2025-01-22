"use client"

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { NAVEmon } from "@/data/navemon";
import { catchNAVEmon } from "@/app/databasefunctions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {QuestionBlock} from "../../../questionfunctions"
import {BattleRenderer} from "../../../components/battlerenderer"

let startTime
let int1
 
export default function MonsterStats() {

    const {data: session,status} = useSession()
    const monsterid = useParams().monsterid
    const navemon = NAVEmon[monsterid]
    const router = useRouter()

    if (status!="authenticated") {
        return (
            <h1>Acesso restrito</h1>
        )
    }

    const totalTime = 21000
    const [started, setStarted] = useState(false)
    const [currentTime,setCurrentTime] = useState(0)
    const [timeLeft, setTimeLeft] = useState(totalTime)
    const [formattedTime, setFormattedTime] = useState(60)
    const [questionBlock, setQuestionBlock] = useState([])

    int1 = setInterval(updateTime,1000);

    function startCatch() {
        startTime = Date.now()
        setCurrentTime(Date.now())
        setStarted(true)
        setQuestionBlock(QuestionBlock(navemon.types,5))
    }

    function formatTime(time) {
        setFormattedTime(parseInt(time))
    }

    function updateTime() {
        if (!started) return
        setCurrentTime(Date.now())
        let time = Math.floor(totalTime - (Date.now() - startTime))/1000
        setTimeLeft(time)
        formatTime(time)

        if (time==0) {
            setStarted(false)
        }
      }

    async function resolveCatch(gotIt) {
        if (gotIt==true) { 
            let cap = await catchNAVEmon(session.user.email,monsterid,true)
            router.replace("/navedex/"+monsterid)
        } else {
            await catchNAVEmon(session.user.email,monsterid,false)
            router.replace("/capturar")
        }
    }

    if (!started) {
        return (
            <div>
                <button onClick={()=> {startCatch()}}>Comecar</button>
            </div>
        )
    } else {

    return (
        <div>
            <BattleRenderer questionlist={questionBlock} time={formattedTime} mode="CATCH" callback={resolveCatch} />
        </div>
    )

    }

}