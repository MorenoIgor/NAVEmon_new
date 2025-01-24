"use client"

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { NAVEmon } from "@/data/navemon";
import { reduceCatches, catchNAVEmon, getUserData } from "@/app/databasefunctions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {QuestionBlock} from "../../../questionfunctions"
import {BattleRenderer} from "../../../components/battlerenderer"
import {Loading} from "../../../components/loading"

let startTime : number
let int1 : any
 
export default function MonsterStats() {

    const {data: session,status} = useSession()
    //const monsterid : number = useParams().monsterid
    let m = useParams().monsterid
    m = parseInt(m)
    //const navemon = NAVEmon[parseInt(monsterid)]
    const router = useRouter()

    if (status!="authenticated") {
        return (
            <h1>Acesso restrito</h1>
        )
    }

    const totalTime = 61000
    const [monsterid,setmonsterid] = useState(m)
    const [navemon,setnavemon] = useState(NAVEmon[m])
    const [started, setStarted] = useState(false)
    const [currentTime,setCurrentTime] = useState(0)
    const [timeLeft, setTimeLeft] = useState(totalTime)
    const [formattedTime, setFormattedTime] = useState(60)
    const [questionBlock, setQuestionBlock] = useState([])
    const [finished, setFinished] = useState(false)
    const [gotIt, setGotIt] = useState(false)

    const [loading,setLoading] = useState(true)

    int1 = setInterval(updateTime,1000);

    async function startCatch() {
        startTime = Date.now()
        setCurrentTime(Date.now())
        setStarted(true)
        setQuestionBlock(QuestionBlock(navemon.types,5))
        await reduceCatches(session.user.email)
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

    async function resolveCatch(got) {
        setGotIt(got)
        if (got==true) { 
            let cap = await catchNAVEmon(session.user.email,monsterid)
            setFinished(true)
            //router.push("/navedex/"+monsterid)
        } else {
            setFinished(true)
            //router.replace("/capturar")
        }
    }

    useEffect(
                () => {
                    async function getCatches() {
                        let data = await getUserData(session?.user.email)
    
                        if (parseInt(data.catches)<=0) {
                            router.replace("/inicio")
                        }
                        setLoading(false)
                    }
                    getCatches()
                }
            ,[])

    if (loading) {
        return (
            <Loading />
        )
    }

    if (!started) {
        return (
            <div>
                <div className="content w-80p">
                    <h2>{navemon.name}</h2>
                    <h5>{navemon.types}</h5>
                    <img src={`/artwork/${monsterid}.png`}></img>
                </div>
                <button className="m-4" onClick={()=> {startCatch()}}>Comecar</button>
            </div>
        )
    } else {

    return (
        <section className="section">
        <div className="content u-center">
            <BattleRenderer questionlist={questionBlock} time={formattedTime} mode="CATCH" callback={resolveCatch} />
            </div>
            {
                gotIt == true ? <div><br /><button className="m-4" onClick={()=> {router.push("/navedex/"+monsterid)}}>Página da Dex</button></div> : ""
            }
            {
                finished == true ? <div><br /><button className="m-4" onClick={()=> {router.replace("/capturar")}}>Voltar</button></div> : ""
            }
        </section>
    )

    }

}