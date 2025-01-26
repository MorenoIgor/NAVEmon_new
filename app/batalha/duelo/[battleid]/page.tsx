"use client"

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { NAVEmon } from "@/data/navemon";
import { getBattleDataById, getUserId, writeBattleData, resolveBattle } from "@/app/databasefunctions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {QuestionBlock} from "../../../questionfunctions"
import {BattleRenderer} from "../../../components/battlerenderer"
import {Loading} from "../../../components/loading"
import { TypeTag } from "@/app/components/typetag";

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

    const totalTime = 61000
    const [started, setStarted] = useState(false)
    const [currentTime,setCurrentTime] = useState(0)
    const [timeLeft, setTimeLeft] = useState(totalTime)
    const [formattedTime, setFormattedTime] = useState(60)
    const [questionBlock, setQuestionBlock] = useState([])
    const [battleData, setBattleData] = useState({})
    const [playerId, setPlayerId] = useState(0)
    const [winner, setWinner] = useState(-1)
    const [done, setDone] = useState(false)
    const [finishedPlaying, setFinishedPlaying] = useState(false)

    const [loading,setLoading] = useState(true)

    int1 = setInterval(updateTime,1000);

    useEffect(
            () => {
                async function getBattleData() {
                    let iddata = await getUserId(session?.user.email)
                    let id = iddata.id
                    let data = await getBattleDataById(parseInt(battleid))

                    if (data==null || (data.player1id!=id && data.player2id!=id)) {
                        router.replace("/inicio")
                    } else {

                        if (data.player1done==true && data.player2done==true && data.status!="FINISHED") {
                            await resolveBattle(data)
                            data.status = "FINISHED"
                        }

                        console.log(data)

                        if (data.player1id==id) {
                            setPlayerId(1)
                            navemon = NAVEmon[data.player2monster]
                        } else {
                            setPlayerId(2)
                            navemon = NAVEmon[data.player1monster]
                        }

                        if (data.status=="FINISHED") {
                            decideWinner(getPoints(data.player1answers),getPoints(data.player2answers))
                        }

                        setBattleData(data)
                        setLoading(false)
                    }
                }
                getBattleData()
            }
        ,[done])

    async function startBattle() {

        startTime = Date.now()
        setCurrentTime(Date.now())
        setStarted(true)
        let qb = QuestionBlock(navemon.types,5)
        

        for (let q of qb) {
            let oa = q.answers[q.rightanswer]
            fy(q.answers)
            for (let qq=0;qq<q.answers.length;qq++) {
                if (q.answers[qq]==oa) {
                    q.rightanswer = qq.toString()
                }
            }
        }

        setQuestionBlock(qb)

        let data = {}

        if (playerId==1) {
            data = {
                player1answers: "0,0,0,0,0",
                player1done: true,
                player1abandon: true
            }
        } else {
            data = {
                player2answers: "0,0,0,0,0",
                player2done: true,
                player2abandon: true
            }
        }

        let ab = await writeBattleData(parseInt(battleid),data)


    }

    //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function fy(a,b,c,d){//array,placeholder,placeholder,placeholder
        c=a.length;while(c)b=Math.random()*c--|0,d=a[c],a[c]=a[b],a[b]=d
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

      function getPoints(pointString) {

        if (pointString=="") {
            return "?"
        }
      
      let arr = pointString.split(",")
      let points = 0

        for (let i=0;i<5;i++) {
            points += parseInt(arr[i])
        }

        return points

    }

    function decideWinner(p1,p2) {

        if (p1>p2) {
            setWinner(1)
        } else if (p2>p1) {
            setWinner(2)
        } else {
            setWinner(0)
        }
      }


      async function finishBattle(result,_pid) {
        let answers = ""
        for (let r of result) {
            // if (r==0) {
            //     answers+="0"
            // } else {
            //     answers+="1"
            // }
            answers += r.toString()
            answers+=","
        }
        answers = answers.slice(0,answers.length-1)
        
        let pid = playerId
        if (_pid!=undefined) {
            pid = _pid
        }

        let data

        if (pid==1) {
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

        setFinishedPlaying(true)

      }

      function getBarColor(pnts) {

        pnts = 500-pnts

        if (pnts>325) {
            return "progress--info"
        } else if (pnts>250 && pnts<=325) {
            return "progress--succes"
        } else if (pnts>125 && pnts<=250) {
            return "progress--warning"
        } else {
            return "progress--danger"
        }

      }

      let overForMe = false
      if ((playerId==1 && battleData.player1done==true) || done) {
        overForMe = true
      }
      if ((playerId==2 && battleData.player2done==true) || done) {
        overForMe = true
      }

    if (loading) {
        return (
            <Loading />
        )
    }

    if (!started && !overForMe) {
        return (
            <div>
                <h4>{playerId == 1 ? `${battleData.player2name}` : `${battleData.player1name}` }</h4>
                <img className="NAVEmonBadgeImage" src={playerId == 1 ? `/artwork/${battleData.player2monster}.png` : `/artwork/${battleData.player1monster}.png`}></img><br />
                <h4>{playerId ==1 ? NAVEmon[battleData.player2monster].name : NAVEmon[battleData.player2monster].name }</h4>
                <TypeTag typestring={playerId == 1 ? NAVEmon[battleData.player2monster].types : NAVEmon[battleData.player1monster].types } />
                <button className="m-4" onClick={()=> {startBattle()}}>Comecar</button>
            </div>
        )
    } else if (!overForMe) {

    return (
        <section>
        <section className="content u-center">
            <BattleRenderer questionlist={questionBlock} time={formattedTime} mode="BATTLE" callback={finishBattle} />
        </section>
            {finishedPlaying ? <button className="m-4" onClick={()=> {setDone(true)}}>Finalizar</button> : ""}
        </section>
    )

    } else if (overForMe) {
        return (
            <section>
            <section className="u-center">
            <section className="grid grid-cols-2 u-gap-2 w-80p">
            <div className="content">
            <h4>{`${battleData.player1name}`}</h4>
            <img className="NAVEmonBadgeImage" src={`/artwork/${battleData.player1monster}.png`}></img><br />
            <h4>{NAVEmon[battleData.player1monster].name}</h4>
            <TypeTag typestring={NAVEmon[battleData.player1monster].types} />
            {/* <h3>Pontos: {getPoints(battleData.player1answers)}</h3>
            {
                winner == 1 ? <h1>🏆</h1> : winner == 2 ? <h1>🏳️</h1> : winner == -1? <h1></h1> :<h1>🤝</h1>
            } */}
            { 
            battleData.player2done == true ?
            <div>
            <h4>{500-getPoints(battleData.player2answers)} / 500</h4>
            <progress className={`w-70p progress ${getBarColor(getPoints(battleData.player2answers))}`} value={500-getPoints(battleData.player2answers)} max="500"></progress>
            {winner == 1 ? <h1>🏆</h1> : winner == 2 ? <h1>🏳️</h1> : winner == -1? <h1></h1> :<h1>🤝</h1>}
            </div>
                : <h2>Aguardando</h2>
            }
            </div>
          
            <div className="content">
            <h4>{`${battleData.player2name}`}</h4>
            <img className="NAVEmonBadgeImage" src={`/artwork/${battleData.player2monster}.png`}></img><br />
            <h4>{NAVEmon[battleData.player2monster].name}</h4>
            <TypeTag typestring={NAVEmon[battleData.player2monster].types} />
            {/* <h3>Pontos: {getPoints(battleData.player2answers)}</h3>
            {
                winner == 2 ? <h1>🏆</h1> : winner == 1 ? <h1>🏳️</h1> : winner == -1 ? <h1></h1> : <h1>🤝</h1>
            } */}
            { 
            battleData.player1done == true ?
            <div>
            <h4>{500-getPoints(battleData.player1answers)} / 500</h4>
            <progress className={`w-70p progress ${getBarColor(getPoints(battleData.player1answers))}`} value={500-getPoints(battleData.player1answers)} max="500"></progress>
                {winner == 2 ? <h1>🏆</h1> : winner == 1 ? <h1>🏳️</h1> : winner == -1 ? <h1></h1> : <h1>🤝</h1>}
            </div>
                : <h2>Aguardando</h2>
            }
            </div>
            </section>
            </section>
            <button className="m-4"  onClick={()=>{router.replace("/inicio/")}}>Voltar para o Início</button>
            </section>
        )
    }

}