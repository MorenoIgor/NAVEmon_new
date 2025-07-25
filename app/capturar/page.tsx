"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { getUserData } from "../databasefunctions"
//import { getNAVEmon} from "../navemonfunctions"
import { NAVEmon } from "@/data/navemon"
import {WildMonsterStats} from "../components/monsterstats"
import {Loading} from "../components/loading"
import { useRouter } from "next/navigation"
import { FiArrowLeft } from "react-icons/fi"
import styles from './Capturar.module.css'

export default function Capturar() {

    const {data: session,status} = useSession()
    const [monsterList, setMonsterList] = useState([])
    const [playerInfo, setPlayerInfo] = useState<any>({})
    const [errorMessage, setErrorMessage] = useState("")
    const [canCatch, setCanCatch] = useState(true)

    const [loading, setLoading] = useState(true)

    const router = useRouter()

    if (status!="authenticated") {
        return (
            <div className={styles.accessRestricted}>
                <h1 className={styles.accessRestrictedTitle}>Acesso restrito</h1>
            </div>
        )
    }

    function buildMonsterList(lst) {

        let _list = []
        for (let n of NAVEmon.slice(1)) {
            if (!lst.includes(n.id)) {
                _list.push(n)
            }
        }
        
        setMonsterList(_list)
    }

    useEffect(
        () => {
            async function getMon() {
                let data = await getUserData(session?.user.email)
                buildMonsterList(data.monsters.split(","))
                setPlayerInfo(data)

                if (parseInt(data.catches)>0) {
                    setCanCatch(true)
                } else {
                    setCanCatch(false)
                }
                setLoading(false)
            }
            getMon()
        }
    ,[])

    function noCatches() {
        setErrorMessage("Você não tem capturas suficientes! Volte amanhã!")
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                {/* Info Section */}
                <div className={styles.infoSection}>
                    <h2 className={styles.capturesCounter}>
                        Capturas restantes: <span className={styles.capturesNumber}>{playerInfo.catches || 0}</span>
                    </h2>
                    {errorMessage && (
                        <p className={styles.errorMessage}>{errorMessage}</p>
                    )}
                </div>

                {/* Monster Grid */}
                {monsterList.length > 0 ? (
                    <div className={styles.monsterGrid}>
                        {monsterList.map((mon) => (
                            <WildMonsterStats 
                                key={`${mon.id}-${Date.now()}-${Math.random()}`}
                                monsterdata={mon} 
                                current={false}
                                cancatch={canCatch}
                                callback={noCatches}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <h3 className={styles.emptyStateTitle}>Todos os NAVEmon capturados!</h3>
                        <p className={styles.emptyStateMessage}>
                            Parabéns! Você já capturou todos os NAVEmon disponíveis.
                        </p>
                    </div>
                )}

                {/* Back Button */}
                <div className={styles.pageActions}>
                    <button 
                        className={styles.backButton}  
                        onClick={() => {router.replace("/inicio/")}}
                    >
                        <FiArrowLeft />
                        Voltar para Início
                    </button>
                </div>
            </div>
        </div>
    )

}


