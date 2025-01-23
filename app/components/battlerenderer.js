"use client"

import { useState } from "react"

export function BattleRenderer(props) {

    const questionList = props.questionlist

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answerArray, setAnswerArray] = useState([false,false,false,false,false])
    const [finished, setFinished] = useState(false)

    function nextQuestion(answer) {
        let arr = answerArray
        arr[currentQuestion] = (parseInt(questionList[currentQuestion].rightanswer)==answer)
        if (currentQuestion<4) {
            setCurrentQuestion(currentQuestion+1)
        } else {
            finishBattle()
        }
    }

    function finishBattle() {
        setFinished(true)
        if (props.mode=="CATCH") {
            let gotIt = !answerArray.includes(false)
            props.callback(gotIt)
        } else {
            props.callback(answerArray)
        }
    }

    if (props.time==0 && !finished) {
        finishBattle()
    }

    if (!finished) {

    return (
        <div className="card">
        <div className="content w-90p">
        <h1>{props.time}</h1>
        <h2 className="title">{questionList[currentQuestion].question}</h2>
        <div className="battleOption u-border-2 u-round-xl u-shadow-md"><h5 onClick={()=>nextQuestion(1)}>{questionList[currentQuestion].answer_1}</h5></div>
        <div className="battleOption u-border-2 u-round-xl u-shadow-md"><h5 onClick={()=>nextQuestion(2)}>{questionList[currentQuestion].answer_2}</h5></div>
        <div className="battleOption u-border-2 u-round-xl u-shadow-md"><h5 onClick={()=>nextQuestion(3)}>{questionList[currentQuestion].answer_3}</h5></div>
        <div className="battleOption u-border-2 u-round-xl u-shadow-md"><h5 onClick={()=>nextQuestion(4)}>{questionList[currentQuestion].answer_4}</h5></div>
        </div>
        </div>

    )

    } else {

        return (
            <div>
                {JSON.stringify(answerArray)}
            </div>
        )

    }

}