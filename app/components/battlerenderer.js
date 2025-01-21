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
        <div>
        <h1>{props.time}</h1>
        <h2>{questionList[currentQuestion].question}</h2>
        <p onClick={()=>nextQuestion(1)}>{questionList[currentQuestion].answer_1}</p>
        <p onClick={()=>nextQuestion(2)}>{questionList[currentQuestion].answer_2}</p>
        <p onClick={()=>nextQuestion(3)}>{questionList[currentQuestion].answer_3}</p>
        <p onClick={()=>nextQuestion(4)}>{questionList[currentQuestion].answer_4}</p>
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