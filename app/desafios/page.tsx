"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { userAlreadyExists, startBattle, getChallenges, getBattleDataById, getUserId } from "../databasefunctions"
import { NAVEmon } from "@/data/navemon"
import { useRouter } from "next/navigation"


export default function Desafios() {

    const {data: session, status} = useSession()

    const [challengeError, setChallengeError] = useState("")
    const [challengesReceived, setChallengesReceived] = useState([])
    const [challengesMade, setChallengesMade] = useState([])

    const router = useRouter()

        useEffect(
            () => {
                async function getChallengesReceived() {
                    let chl = await getChallenges(session?.user.email,"received")
                    let chllist = chl.challenges_received.split(",")
                    let arr = []

                    let uid = await getUserId(session?.user.email)

                    for (let c of chllist) {
                        if (c!="") {
                            let bd = await getBattleDataById(parseInt(c))

                            if (bd==null) {
                                continue
                            }
                            arr.push(
                                {
                                    trainerName: bd.player1name,
                                    navemon: NAVEmon[bd.player1monster].name,
                                    battleid: parseInt(c)
                                }
                            )
                        }
                    }
                    setChallengesReceived(arr)
                }
                async function getChallengesMade() {
                    let chl = await getChallenges(session?.user.email,"made")
                    let chllist = chl.challenges_made.split(",")
                    let arr = []

                    let uid = await getUserId(session?.user.email)

                    for (let c of chllist) {
                        if (c!="") {
                            let bd = await getBattleDataById(parseInt(c))

                            if (bd==null) {
                                continue
                            }
                            arr.push(
                                {
                                    trainerName: bd.player2name,
                                    navemon: NAVEmon[bd.player2monster].name,
                                    battleid: parseInt(c)
                                }
                            )
                        }
                    }
                    setChallengesMade(arr)
                }
                getChallengesReceived()
                getChallengesMade()
            }
        ,[])


    async function challenge() {
        let target = document.querySelector("#challenge").value
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
    }

    function goToBattle(battleid) {
        router.replace("/batalha/duelo/"+battleid)
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

            <input id="challenge"></input>
            <button onClick={()=>challenge()}>Desafiar</button>
            <p>{challengeError}</p>
        </div>

    )

}