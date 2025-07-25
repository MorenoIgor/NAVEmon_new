"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { getUserMonsters } from "../databasefunctions"
//import { getNAVEmon} from "../navemonfunctions"
import { NAVEmon } from "@/data/navemon"
import { useRouter } from "next/navigation"
import {CaughtMonsterStats} from "../components/monsterstats"
import { Loading } from "../components/loading"
import styles from './Lista.module.css'

export default function Lista() {

    const {data: session,status} = useSession()
    const [monsterList, setMonsterList] = useState([])
    const [currentMonster, setCurrentMonster] = useState(-1)

    const [loading, setLoading] = useState(true)

    const router = useRouter()

    if (status!="authenticated") {
        return (
            <div className={styles.accessRestricted}>
                <h1 className={styles.accessRestrictedTitle}>Acesso restrito</h1>
            </div>
        )
    }

    useEffect(
        () => {
            async function getMon() {
                let data = await getUserMonsters(session?.user.email)
                setMonsterList(data.monsters.split(","))
                setCurrentMonster(data.currentmonster)
                setLoading(false)
                
            }
            getMon()
        }
    ,[])

    if (loading) {
        return (
            <Loading />
        )
    }

    const totalCaptured = monsterList.filter(mon => mon.trim() !== '').length
    const totalAvailable = NAVEmon.length - 1 // Subtraindo o índice 0 que não é usado
    const capturePercentage = totalAvailable > 0 ? Math.round((totalCaptured / totalAvailable) * 100) : 0

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                {/* Header Section */}
                <div className={styles.headerSection}>
                    <h1 className={styles.pageTitle}>Minha Coleção</h1>
                    <p className={styles.pageSubtitle}>
                        Visualize todos os NAVEmon que você capturou
                    </p>
                </div>

                {/* Stats Section */}
                <div className={styles.statsSection}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{totalCaptured}</div>
                        <div className={styles.statLabel}>Capturados</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{totalAvailable}</div>
                        <div className={styles.statLabel}>Total</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{capturePercentage}%</div>
                        <div className={styles.statLabel}>Progresso</div>
                    </div>
                </div>

                {/* Monster Grid */}
                {totalCaptured > 0 ? (
                    <div className={styles.monsterGrid}>
                        {monsterList
                            .filter(mon => mon.trim() !== '')
                            .map((mon) => (
                                <CaughtMonsterStats 
                                    key={`${mon}-${Date.now()}-${Math.random()}`}
                                    monsterdata={NAVEmon[parseInt(mon)]} 
                                    caught={monsterList.includes(mon)}
                                    current={currentMonster == parseInt(mon)}
                                />
                            ))
                        }
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyStateIcon}>🔍</div>
                        <h3 className={styles.emptyStateTitle}>Nenhum NAVEmon capturado ainda</h3>
                        <p className={styles.emptyStateMessage}>
                            Comece sua jornada capturando seu primeiro NAVEmon!
                        </p>
                        <button 
                            className={styles.emptyStateButton}
                            onClick={() => {router.replace("/capturar/")}}
                        >
                            Ir para Capturar
                        </button>
                    </div>
                )}

                {/* Back Button */}
                <button 
                    className={styles.backButton} 
                    onClick={() => {router.replace("/inicio/")}}
                >
                    Voltar para o Início
                </button>
            </div>
        </div>
    )

}


