"use client"

import { useState } from "react"

export function BattleRenderer(props) {

    const questionList = props.questionlist

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answerArray, setAnswerArray] = useState([false,false,false,false,false])
    const [questionRightAnswers, setQuestionRightAnswers] = useState([])
    const [finished, setFinished] = useState(false)

    function nextQuestion(answer) {
        let arr = answerArray
        arr[currentQuestion] = (parseInt(questionList[currentQuestion].rightanswer)==answer-1)
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
            props.callback(answerArray,undefined)
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
        <div className="battleOption u-border-2 u-round-xl u-shadow-md"><h5 onClick={()=>nextQuestion(1)}>{questionList[currentQuestion].answers[0]}</h5></div>
        <div className="battleOption u-border-2 u-round-xl u-shadow-md"><h5 onClick={()=>nextQuestion(2)}>{questionList[currentQuestion].answers[1]}</h5></div>
        <div className="battleOption u-border-2 u-round-xl u-shadow-md"><h5 onClick={()=>nextQuestion(3)}>{questionList[currentQuestion].answers[2]}</h5></div>
        <div className="battleOption u-border-2 u-round-xl u-shadow-md"><h5 onClick={()=>nextQuestion(4)}>{questionList[currentQuestion].answers[3]}</h5></div>
        </div>
        </div>

    )

    } else {

        return (

            <div>

            <div className="card">
                <div className="content w-90p">
                <h4 className="title">{questionList[0].question}</h4>
                <div className={`u-border-2 u-round-xl u-shadow-md ${answerArray[0] == true ? " bg-success" : " bg-danger"}`}><h5>{questionList[0].answers[questionList[0].rightanswer]}</h5></div>
                </div>
            </div>

            <div className="card">
                <div className="content w-90p">
                <h4 className="title">{questionList[1].question}</h4>
                <div className={`u-border-2 u-round-xl u-shadow-md ${answerArray[1] == true ? " bg-success" : " bg-danger"}`}><h5>{questionList[1].answers[questionList[1].rightanswer]}</h5></div>
                </div>
            </div>

            <div className="card">
                <div className="content w-90p">
                <h4 className="title">{questionList[2].question}</h4>
                <div className={`u-border-2 u-round-xl u-shadow-md ${answerArray[2] == true ? " bg-success" : " bg-danger"}`}><h5>{questionList[2].answers[questionList[2].rightanswer]}</h5></div>
                </div>
            </div>

            <div className="card">
                <div className="content w-90p">
                <h4 className="title">{questionList[3].question}</h4>
                <div className={`u-border-2 u-round-xl u-shadow-md ${answerArray[3] == true ? " bg-success" : " bg-danger"}`}><h5>{questionList[3].answers[questionList[3].rightanswer]}</h5></div>
                </div>
            </div>

            <div className="card">
                <div className="content w-90p">
                <h4 className="title">{questionList[4].question}</h4>
                <div className={`u-border-2 u-round-xl u-shadow-md ${answerArray[4] == true ? " bg-success" : " bg-danger"}`}><h5>{questionList[4].answers[questionList[4].rightanswer]}</h5></div>
                </div>
            </div>


            </div>
    
        )

    }

}