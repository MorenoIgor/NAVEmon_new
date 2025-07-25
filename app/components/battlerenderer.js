"use client"

import { useState } from "react"
import { FiCheck, FiX } from "react-icons/fi"
import styles from "./BattleRenderer.module.css"

export function BattleRenderer(props) {

    const questionList = props.questionlist

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answerArray, setAnswerArray] = useState([0,0,0,0,0])
    const [finished, setFinished] = useState(false)
    const [startTime, setStartTime] = useState(Date.now())

    function nextQuestion(answer) {
        //let arr = answerArray
        let points = 100 - Math.floor((Date.now() - startTime)/100)
        if (points<=0) {
            points = 10
        }
        answerArray[currentQuestion] = (parseInt(questionList[currentQuestion].rightanswer)==answer-1) * points

        setStartTime(Date.now())

        if (currentQuestion<4) {
            setCurrentQuestion(currentQuestion+1)
        } else {
            finishBattle()
        }
    }

    function finishBattle() {
        setFinished(true)
        if (props.mode=="CATCH") {
            let gotIt = !answerArray.includes(0)
            props.callback(gotIt)
        } else {
            props.callback(answerArray,undefined)
        }
    }

    if (props.time==0 && !finished) {
        finishBattle()
    }

    if (!finished) {

    const progress = ((currentQuestion) / 5) * 100;
    const timerClass = props.time <= 10 ? styles.danger : props.time <= 20 ? styles.warning : '';

    return (
        <div className={`${styles.battleCard} ${styles.slideInUp}`}>
            <div className={styles.activeBattle}>
                <div className={styles.progressBar}>
                    <div 
                        className={styles.progressFill} 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                
                <div className={`${styles.timer} ${timerClass}`}>
                    {props.time}
                </div>
                
                <h2 className={styles.questionTitle}>
                    {questionList[currentQuestion].question}
                </h2>
                
                <div className={styles.optionsContainer}>
                    <div className={styles.battleOption} onClick={() => nextQuestion(1)}>
                        <h5 className={styles.optionText}>
                            {questionList[currentQuestion].answers[0]}
                        </h5>
                    </div>
                    <div className={styles.battleOption} onClick={() => nextQuestion(2)}>
                        <h5 className={styles.optionText}>
                            {questionList[currentQuestion].answers[1]}
                        </h5>
                    </div>
                    <div className={styles.battleOption} onClick={() => nextQuestion(3)}>
                        <h5 className={styles.optionText}>
                            {questionList[currentQuestion].answers[2]}
                        </h5>
                    </div>
                    <div className={styles.battleOption} onClick={() => nextQuestion(4)}>
                        <h5 className={styles.optionText}>
                            {questionList[currentQuestion].answers[3]}
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    )

    } else {

        const renderResultCard = (index) => {
            const isCorrect = answerArray[index] > 0;
            const question = questionList[index];
            
            return (
                <div 
                    key={index}
                    className={`${styles.resultCard} ${isCorrect ? styles.correct : styles.incorrect} ${styles.slideInUp}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className={`${styles.statusIcon} ${isCorrect ? styles.correct : styles.incorrect}`}>
                        {isCorrect ? <FiCheck /> : <FiX />}
                    </div>
                    
                    <h4 className={styles.resultQuestion}>
                        {question.question}
                    </h4>
                    
                    <div className={`${styles.correctAnswer} ${isCorrect ? styles.correct : styles.incorrect}`}>
                        <h5 className={styles.answerText}>
                            {question.answers[question.rightanswer]}
                        </h5>
                    </div>
                    
                    <div className={styles.pointsDisplay}>
                        <p className={styles.pointsLabel}>Pontos:</p>
                        <p className={`${styles.pointsValue} ${answerArray[index] > 0 ? styles.positive : styles.zero}`}>
                            {answerArray[index]}
                        </p>
                    </div>
                </div>
            );
        };

        return (
            <div className={styles.resultsContainer}>
                {[0, 1, 2, 3, 4].map(renderResultCard)}
            </div>
        )

    }

}