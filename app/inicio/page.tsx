"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { useState,useEffect } from "react"
import { getUserData } from "../databasefunctions"
import { Loading } from "../components/loading"
import { NAVEmon } from "@/data/navemon"
import { TypeTag } from "../components/typetag"
import styles from './Inicio.module.css'
import { 
    FiUser, 
    FiAward, 
    FiTarget, 
    FiTrendingUp,
    FiTrendingDown,
    FiMinus,
    FiCalendar,
    FiBookOpen,
    FiStar,
    FiZap,
    FiShield,
    FiHeart
} from 'react-icons/fi'

export default function Inicio() {

    const router = useRouter()
    const {data: session,status} = useSession()

    const [playerInfo, setPlayerInfo] = useState<any>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/")
        } else if (status === "authenticated" && session?.user?.email) {
            async function getPlayerInfo() {
                try {
                    let data = await getUserData(session.user.email)
                    console.log(data)
                    setPlayerInfo(data)
                } catch (error) {
                    console.error("Erro ao buscar dados do usuário:", error)
                } finally {
                    setLoading(false)
                }
            }
            getPlayerInfo()
        }
    }, [status, session, router])

    if (status === "loading" || loading) {
        return (
            <Loading />
        )
    }

    if (status === "unauthenticated") {
        return null
    }

    const totalBattles = (playerInfo.wins || 0) + (playerInfo.losses || 0) + (playerInfo.draws || 0)
    const winRate = totalBattles > 0 ? ((playerInfo.wins || 0) / totalBattles * 100).toFixed(1) : "0"
    const monstersCount = playerInfo.monsters ? playerInfo.monsters.split(',').filter(m => m.trim() !== '').length : 0
    const challengesReceived = playerInfo.challenges_received ? playerInfo.challenges_received.split(',').filter(c => c.trim() !== '').length : 0
    
    // Pegar NAVEmon atual
    const currentNavemon = playerInfo.currentmonster ? NAVEmon[parseInt(playerInfo.currentmonster)] : null

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                {/* Header do Usuário */}
                <div className={styles.userHeader}>
                    <figure className={styles.userAvatar}>
                        <img 
                            src={session?.user.image} 
                            alt={session?.user.name}
                            className={styles.userAvatarImage}
                        />
                    </figure>
                    <div className={styles.userInfo}>
                        <h1 className={styles.userName}>
                            {session?.user.name}
                        </h1>
                        <div className={styles.userDetails}>
                            <span className={styles.userDetailItem}>
                                <strong>Curso:</strong> {playerInfo.course === "MULT" ? "Multimídia" : "Programação"}
                            </span>
                            <span className={styles.userDetailItem}>
                                <strong>Série:</strong> {playerInfo.year}ª
                            </span>
                        </div>
                    </div>
                </div>

                {/* NAVEmon Atual */}
                {currentNavemon && (
                    <div className={styles.currentMonsterCard}>
                        <div className={styles.currentMonsterHeader}>
                            <FiHeart className={styles.currentMonsterIcon} />
                            <h2 className={styles.currentMonsterTitle}>
                                NAVEmon Principal
                            </h2>
                        </div>
                        
                        <div className={styles.currentMonsterContent}>
                            <div className={styles.currentMonsterImage}>
                                <img 
                                    src={`/artwork/${playerInfo.currentmonster}.png`}
                                    alt={currentNavemon.name}
                                    className={styles.monsterImg}
                                />
                            </div>
                            
                            <div className={styles.currentMonsterInfo}>
                                <h3 className={styles.monsterName}>
                                    {currentNavemon.name}
                                </h3>
                                <div className={styles.monsterNumber}>
                                    #{String(playerInfo.currentmonster).padStart(3, '0')}
                                </div>
                                <div className={styles.typeContainer}>
                                    <TypeTag typestring={currentNavemon.types} />
                                </div>
                                {/* <p className={styles.monsterDescription}>
                                    {currentNavemon.description}
                                </p> */}
                            </div>
                        </div>
                    </div>
                )}

                {/* Estatísticas */}
                <div className={styles.statsContainer}>
                    <h2 className={styles.statsHeader}>
                        Estatísticas
                    </h2>
                    
                    <div className={styles.statsList}>
                        {/* Coleção */}
                        <div className={styles.statItem}>
                            <div className={styles.statItemLeft}>
                                <FiStar className={`${styles.statIcon} ${styles.statIconGold}`} />
                                <span className={styles.statLabel}>Coleção NAVEMon</span>
                            </div>
                            <span className={styles.statValue}>
                                {monstersCount}
                            </span>
                        </div>

                        {/* Batalhas */}
                        <div className={styles.statItem}>
                            <div className={styles.statItemLeft}>
                                <FiShield className={`${styles.statIcon} ${styles.statIconPurple}`} />
                                <span className={styles.statLabel}>Batalhas</span>
                            </div>
                            <span className={styles.statValue}>
                                {totalBattles}
                            </span>
                        </div>

                        {/* Vitórias */}
                        <div className={styles.statItem}>
                            <div className={styles.statItemLeft}>
                                <FiTrendingUp className={`${styles.statIcon} ${styles.statIconGreen}`} />
                                <span className={styles.statLabel}>Vitórias</span>
                            </div>
                            <span className={`${styles.statValue} ${styles.statValueGreen}`}>
                                {playerInfo.wins || 0}
                            </span>
                        </div>

                        {/* Derrotas */}
                        <div className={styles.statItem}>
                            <div className={styles.statItemLeft}>
                                <FiTrendingDown className={`${styles.statIcon} ${styles.statIconRed}`} />
                                <span className={styles.statLabel}>Derrotas</span>
                            </div>
                            <span className={`${styles.statValue} ${styles.statValueRed}`}>
                                {playerInfo.losses || 0}
                            </span>
                        </div>

                        {/* Empates */}
                        <div className={styles.statItem}>
                            <div className={styles.statItemLeft}>
                                <FiMinus className={`${styles.statIcon} ${styles.statIconGray}`} />
                                <span className={styles.statLabel}>Empates</span>
                            </div>
                            <span className={`${styles.statValue} ${styles.statValueGray}`}>
                                {playerInfo.draws || 0}
                            </span>
                        </div>

                        {/* Taxa de Vitória */}
                        <div className={styles.statItem}>
                            <div className={styles.statItemLeft}>
                                <FiTarget className={`${styles.statIcon} ${styles.statIconBlue}`} />
                                <span className={styles.statLabel}>Taxa de Vitória</span>
                            </div>
                            <span className={styles.statValue}>
                                {winRate}%
                            </span>
                        </div>

                        {/* Capturas */}
                        <div className={styles.statItem}>
                            <div className={styles.statItemLeft}>
                                <FiZap className={`${styles.statIcon} ${styles.statIconOrange}`} />
                                <span className={styles.statLabel}>Capturas Restantes</span>
                            </div>
                            <span className={styles.statValue}>
                                {playerInfo.catches || 0}
                            </span>
                        </div>

                        {/* Desafios Completados */}
                        <div className={styles.statItem}>
                            <div className={styles.statItemLeft}>
                                <FiAward className={`${styles.statIcon} ${styles.statIconAmber}`} />
                                <span className={styles.statLabel}>Capturas Realizadas</span>
                            </div>
                            <span className={styles.statValue}>
                                {playerInfo.challenges || 0}
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}