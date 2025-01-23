"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { userAlreadyExists, startBattle, getChallenges, getChallengesReceived, getChallengesMade, getBattleDataById, getUserId, getUserData } from "../databasefunctions"
import { NAVEmon } from "@/data/navemon"
import { useRouter } from "next/navigation"

import { Loading } from "../components/loading"


export default function Desafios() {

    const {data: session, status} = useSession()

    const [challengeError, setChallengeError] = useState("")
    const [challengesReceived, setChallengesReceived] = useState([])
    const [challengesMade, setChallengesMade] = useState([])
    const [playerInfo, setPlayerInfo] = useState({})

    const [loading, setLoading] = useState(true)

    const router = useRouter()

        useEffect(
            () => {
                async function retrieveChallengesReceived() {
                    let data = await getUserId(session?.user.email)

                    let uid = parseInt(data.id)

                    let cr = await getChallengesReceived(uid)

                    let arr = []

                    for (let c of cr) {
                        arr.push({
                            trainerName: c.player1name,
                            navemon: NAVEmon[c.player1monster].name,
                            battleid: parseInt(c.id)
                            }
                        )
                    }

                    setChallengesReceived(arr)
                }

                async function retrieveChallengesMade() {
                    let data = await getUserId(session?.user.email)

                    let uid = parseInt(data.id)

                    let cr = await getChallengesMade(uid)

                    let arr = []

                    for (let c of cr) {
                        arr.push({
                            trainerName: c.player2name,
                            navemon: NAVEmon[c.player2monster].name,
                            battleid: parseInt(c.id)
                            }
                        )
                    }

                    setChallengesMade(arr)
                    setLoading(false)
                }

                async function getPlayerInfo() {
                        let data = await getUserData(session?.user.email)
                        setPlayerInfo(data)
                }
                retrieveChallengesReceived()
                retrieveChallengesMade()
                getPlayerInfo()
            }
        ,[])


    async function challenge() {
        let target = document.querySelector("#challenge").value
        if (parseInt(playerInfo.challenges)>0) {
            if (target!=session?.user?.email) {
                if (await userAlreadyExists(target)) {
                    let btl = await startBattle(session?.user.email,target)
                    router.replace("/batalha/duelo/"+btl.id)
                    //Não deixar iniciar uma batalha se já tiver outra em curso com a mesma pessoa!
                } else {
                    setChallengeError("Este email não existe!")
                }
            } else {
                setChallengeError("Você não pode se desafiar!")
            }
        } else {
            setChallengeError("Você não tem desafios suficientes! Volte amanhã!")
        }
    }

    function goToBattle(battleid) {
        router.replace("/batalha/duelo/"+battleid)
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (

        <div>
            <h2>Desafios RECEBIDOS</h2>
            {
                challengesReceived.map(
                    (ch) => (
                        <p onClick={()=>goToBattle(ch.battleid)} key={Date.now()+Math.random()*65535}>{`${ch.trainerName} com NAVEmon ${ch.navemon}`}</p>
                    )
                )
            }

            <h2>Desafios FEITOS</h2>
            {
                challengesMade.map(
                    (ch) => (
                        <p onClick={()=>goToBattle(ch.battleid)} key={Date.now()+Math.random()*65535}>{`${ch.trainerName} com NAVEmon ${ch.navemon}`}</p>
                    )
                )
            }

            <p>
            <b>Vitórias: </b>{playerInfo.wins }<br />
            <b>Derrotas: </b>{playerInfo.losses}<br />
            <b>Empates: </b>{playerInfo.draws}<br />
            </p>

            <b>Desafios restantes: {playerInfo.challenges}</b><br />
            <input id="challenge"></input>
            <button className="m-4"  onClick={()=>challenge()}>Desafiar</button>
            <p>{challengeError}</p>
            <p><button className="m-4"  onClick={()=>{router.replace("/inicio/")}}>Voltar para Início</button></p>
        </div>

    )

}