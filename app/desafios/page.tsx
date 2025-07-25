"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { userAlreadyExists, startBattle, getChallenges, getChallengesReceived, getChallengesMade, getBattleDataById, getUserId, getUserData } from "../databasefunctions"
import { NAVEmon } from "@/data/navemon"
import { useRouter } from "next/navigation"
import { Loading } from "../components/loading"
import { FiZap, FiShield, FiAward, FiMinus, FiTarget, FiArrowLeft, FiMail } from "react-icons/fi"
import styles from "./Desafios.module.css"


export default function Desafios() {

    const {data: session, status} = useSession()

    const [challengeError, setChallengeError] = useState("")
    const [challengesReceived, setChallengesReceived] = useState([])
    const [challengesMade, setChallengesMade] = useState([])
    const [playerInfo, setPlayerInfo] = useState<any>({})
    const [challengeEmail, setChallengeEmail] = useState("")

    const [loading, setLoading] = useState(true)

    const router = useRouter()

        useEffect(
            () => {
                async function retrieveChallengesReceived() {
                    // let data = await getUserId(session?.user.email)

                    // let uid = parseInt(data.id)

                    let cr = await getChallengesReceived(session?.user.email)

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
                    // let data = await getUserId(session?.user.email)

                    // let uid = parseInt(data.id)

                    let cr = await getChallengesMade(session?.user.email)

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
        const target = challengeEmail
        if (parseInt(playerInfo.challenges)>0) {
            if (target!=session?.user?.email) {
                setLoading(true)
                if (await userAlreadyExists(target)) {
                    let btl = await startBattle(session?.user.email,target)
                    router.replace("/batalha/duelo/"+btl.id)
                    //Não deixar iniciar uma batalha se já tiver outra em curso com a mesma pessoa!
                } else {
                    setChallengeError("Este email não existe!")
                    setLoading(false)
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
        <div className={`${styles.container} ${styles.slideInUp}`}>
            <h1 className={styles.pageTitle}>
                <FiZap />
                Arena de Desafios
            </h1>

            {/* Estatísticas do jogador */}
            <div className={styles.playerStats}>
                <h3 className={styles.statsTitle}>
                    <FiAward />
                    Suas Estatísticas
                </h3>
                <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Vitórias</span>
                        <span className={`${styles.statValue} ${styles.wins}`}>
                            {playerInfo.wins || 0}
                        </span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Derrotas</span>
                        <span className={`${styles.statValue} ${styles.losses}`}>
                            {playerInfo.losses || 0}
                        </span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Empates</span>
                        <span className={`${styles.statValue} ${styles.draws}`}>
                            {playerInfo.draws || 0}
                        </span>
                    </div>
                </div>
                <div className={styles.challengesRemaining}>
                    Desafios restantes: {playerInfo.challenges || 0}
                </div>
            </div>

            {/* Formulário de desafio */}
            <div className={styles.challengeForm}>
                <h3 className={styles.formTitle}>
                    <FiTarget />
                    Desafiar Treinador
                </h3>
                <div className={styles.inputGroup}>
                    <input 
                        className={styles.challengeInput}
                        type="email"
                        placeholder="Email do treinador..."
                        value={challengeEmail}
                        onChange={(e) => setChallengeEmail(e.target.value)}
                    />
                    <button 
                        className={styles.primaryButton}
                        onClick={challenge}
                        disabled={!challengeEmail.trim()}
                    >
                        <FiZap />
                        Desafiar
                    </button>
                </div>
                {challengeError && (
                    <div className={styles.errorMessage}>
                        <FiMail />
                        {challengeError}
                    </div>
                )}
            </div>

            {/* Desafios recebidos */}
            <div className={styles.challengeSection}>
                <h2 className={`${styles.sectionTitle} ${styles.received}`}>
                    <FiShield />
                    Desafios Recebidos
                </h2>
                <div className={styles.challengeList}>
                    {challengesReceived.length > 0 ? (
                        challengesReceived.map((ch: any) => (
                            <div 
                                className={`${styles.challengeItem} ${styles.fadeIn}`}
                                onClick={() => goToBattle(ch.battleid)} 
                                key={Date.now() + Math.random() * 65535}
                            >
                                <span className={styles.challengeText}>
                                    {ch.trainerName} com NAVEmon {ch.navemon}
                                </span>
                                <span className={styles.challengeNav}>
                                    Clique para batalhar →
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            Nenhum desafio recebido
                        </div>
                    )}
                </div>
            </div>

            {/* Desafios feitos */}
            <div className={styles.challengeSection}>
                <h2 className={`${styles.sectionTitle} ${styles.made}`}>
                    <FiZap />
                    Desafios Enviados
                </h2>
                <div className={styles.challengeList}>
                    {challengesMade.length > 0 ? (
                        challengesMade.map((ch: any) => (
                            <div 
                                className={`${styles.challengeItem} ${styles.fadeIn}`}
                                onClick={() => goToBattle(ch.battleid)} 
                                key={Date.now() + Math.random() * 65535}
                            >
                                <span className={styles.challengeText}>
                                    {ch.trainerName} com NAVEmon {ch.navemon}
                                </span>
                                <span className={styles.challengeNav}>
                                    Clique para ver batalha →
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            Nenhum desafio enviado
                        </div>
                    )}
                </div>
            </div>

            {/* Ações da página */}
            <div className={styles.pageActions}>
                <button 
                    className={styles.secondaryButton}
                    onClick={() => router.replace("/inicio/")}
                >
                    <FiArrowLeft />
                    Voltar para Início
                </button>
            </div>
        </div>
    )

}