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
import { TypeTag } from "@/app/components/typetag";
import { FiPlay, FiBook, FiArrowLeft } from "react-icons/fi";
import styles from "./Captura.module.css";

let startTime : number
let int1 : any

export default function MonsterStats() {

    const {data: session,status} = useSession()
    const params = useParams()
    const monsterIdParam = Array.isArray(params.monsterid) ? params.monsterid[0] : params.monsterid
    const m = parseInt(monsterIdParam || "1")
    const router = useRouter()

    if (status!="authenticated") {
        return (
            <div className={styles.container}>
                <div className={styles.accessDenied}>
                    <h1>Acesso restrito</h1>
                    <p>Você precisa estar logado para acessar esta página</p>
                </div>
            </div>
        )
    }

    // const totalTime = 610000
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
        console.log(time)
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
            <div className={styles.container}>
                <Loading />
            </div>
        )
    }

    if (!started) {
        return (
            <div className={styles.container}>
                <div className={styles.previewContainer}>
                    <div className={`${styles.monsterCard} ${styles.slideIn}`}>
                        <h2 className={styles.monsterName}>{navemon.name}</h2>
                        <div className={styles.typeContainer}>
                            <TypeTag typestring={navemon.types} />
                        </div>
                        <img 
                            src={`/artwork/${monsterid}.png`}
                            alt={navemon.name}
                            className={`${styles.monsterImage} ${styles.pulse}`}
                        />
                    </div>
                    <button 
                        className={styles.startButton} 
                        onClick={() => startCatch()}
                    >
                        Começar Captura
                        <FiPlay style={{ marginLeft: '0.5rem' }} />
                    </button>
                </div>
            </div>
        )
    } else {

    return (
        <section className={styles.battleSection}>
            <div className={styles.battleContent}>
                <BattleRenderer questionlist={questionBlock} time={formattedTime} mode="CATCH" callback={resolveCatch} />
                
                {finished && (
                    <div className={styles.resultActions}>
                        {gotIt ? (
                            <>
                                <div className={`${styles.resultMessage} ${styles.success}`}>
                                    🎉 Parabéns! Você capturou {navemon.name}!
                                </div>
                                <button 
                                    className={`${styles.actionButton} ${styles.success}`}
                                    onClick={() => router.push("/navedex/" + monsterid)}
                                >
                                    <FiBook style={{ marginRight: '0.5rem' }} />
                                    Ver na Navedex
                                </button>
                            </>
                        ) : (
                            <div className={`${styles.resultMessage} ${styles.failure}`}>
                                😔 Que pena! {navemon.name} escapou desta vez.
                            </div>
                        )}
                        <button 
                            className={styles.actionButton}
                            onClick={() => router.replace("/capturar")}
                        >
                            <FiArrowLeft style={{ marginRight: '0.5rem' }} />
                            Voltar para Capturar
                        </button>
                    </div>
                )}
            </div>
        </section>
    )

    }

}