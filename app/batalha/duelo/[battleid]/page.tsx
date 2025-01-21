"use client"

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { NAVEmon } from "@/data/navemon";
import { getBattleDataById, getUserId, writeBattleData } from "@/app/databasefunctions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {QuestionBlock} from "../../../questionfunctions"
import {BattleRenderer} from "../../../components/battlerenderer"

let startTime
let int1
let navemon
 
export default function MonsterStats() {

    const {data: session,status} = useSession()
    const battleid = useParams().battleid
    const router = useRouter()

    if (status!="authenticated") { //
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
    const [battleData, setBattleData] = useState({})
    const [playerId, setPlayerId] = useState(0)
    const [done, setDone] = useState(false)

    int1 = setInterval(updateTime,1000);

    useEffect(
            () => {
                async function getBattleData() {
                    let iddata = await getUserId(session?.user.email)
                    let id = iddata.id
                    let data = await getBattleDataById(parseInt(battleid))
                    setBattleData(data)

                    if (data.player1id==id) {
                        setPlayerId(1)
                        navemon = NAVEmon[data.player2monster]
                    } else {
                        setPlayerId(2)
                        navemon = NAVEmon[data.player1monster]
                    }
                }
                getBattleData()
            }
        ,[done])

    function startBattle() {
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


      async function resolveBattle(result) {
        let answers = ""
        for (let r of result) {
            if (r==false) {
                answers+="0"
            } else {
                answers+="1"
            }
            answers+=","
        }
        answers = answers.slice(0,answers.length-1)
        
        let data

        if (playerId==1) {
            data = {
                player1answers: answers,
                player1done: true
            }
        } else {
            data = {
                player2answers: answers,
                player2done: true
            }
        }

        let wr = await writeBattleData(parseInt(battleid),data)

        setDone(true)
      }

      let overForMe = false
      if ((playerId==1 && battleData.player1done==true) || done) {
        overForMe = true
      }
      if ((playerId==2 && battleData.player2done==true) || done) {
        overForMe = true
      }

    if (!started && !overForMe) {
        return (
            <div>
                <h1>{playerId}</h1>
                <button onClick={()=> {startBattle()}}>Comecar</button>
            </div>
        )
    } else if (!overForMe) {

    return (
        <div>
            <BattleRenderer questionlist={questionBlock} time={formattedTime} mode="BATTLE" callback={resolveBattle} />
        </div>
    )

    } else if (overForMe) {
        return (
        <div className="battleResultContainer">
            <div className="battleResultPanel">
            <h2>{`${battleData.player1name}`}</h2>
            <img className="NAVEmonBadgeImage" src={`/artwork/${battleData.player1monster}.png`}></img><br />
            <p>{battleData.player1answers}</p>
            </div>
            <div className="battleResultPanel">
            <h2>{`${battleData.player2name}`}</h2>
            <img className="NAVEmonBadgeImage" src={`/artwork/${battleData.player2monster}.png`}></img><br />
            <p>{battleData.player2answers}</p>
            </div>
        </div>
        )
    }

}