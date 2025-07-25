"use client"

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { NAVEmon } from "@/data/navemon";
import { getUserCurrentMonster, setCurrentNAVEmon } from "@/app/databasefunctions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TypeTag } from "../../components/typetag";
import { FiStar, FiArrowLeft, FiBook, FiX } from "react-icons/fi";
import styles from "./Navedex.module.css";

export default function MonsterStats() {

    const {data: session,status} = useSession()
    const params = useParams()
    const monsterIdParam = Array.isArray(params.monsterid) ? params.monsterid[0] : params.monsterid
    const monsterId = parseInt(monsterIdParam || "1")
    const [current, setCurrent] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const router = useRouter()

    if (status!="authenticated") {
        return (
            <div className={styles.container}>
                <div className={styles.accessDenied}>
                    <h1>Acesso restrito</h1>
                    <p>Você precisa estar logado para acessar esta página</p>
                </div>
            </div>
        )
    }

    const navemon = NAVEmon[monsterId]

    async function changeMain() {
        await setCurrentNAVEmon(session.user.email, monsterId)
        setCurrent(true)
        router.replace("/lista/")
    }

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleModalClick = (e: React.MouseEvent) => {
        // Fechar modal se clicar no overlay (fora da imagem)
        if (e.target === e.currentTarget) {
            closeModal()
        }
    }

    useEffect(
            () => {
                async function getMonCurrent() {
                    let data = await getUserCurrentMonster(session?.user.email)
                    let cur = (data.currentmonster == monsterId)
                    setCurrent(cur)
                    
                }
                getMonCurrent()
            }
        ,[current, monsterId])

    return (
        <div className={styles.container}>
            <div className={`${styles.monsterCard} ${styles.slideInUp}`}>
                {current && (
                    <div className={`${styles.statusIndicator} ${styles.current}`}>
                        <FiStar />
                        Principal
                    </div>
                )}
                
                <div className={styles.monsterHeader}>
                    <h1 className={styles.monsterTitle}>
                        {navemon.name}
                        {current && <span className={styles.currentBadge}>⭐</span>}
                    </h1>
                    <div className={styles.monsterNumber}>
                        #{String(monsterId).padStart(3, '0')}
                    </div>
                    <div className={styles.typeContainer}>
                        <TypeTag typestring={navemon.types} />
                    </div>
                </div>
                
                <div className={styles.imageContainer}>
                    <img 
                        className={`${styles.monsterImage} ${current ? styles.current : ''}`}
                        src={`/artwork/${monsterId}.png`}
                        alt={navemon.name}
                        onClick={openModal}
                    />
                </div>
                
                {/* <div className={styles.description}>
                    <h3 className={styles.descriptionTitle}>
                        <FiBook />
                        Descrição
                    </h3>
                    <p className={styles.descriptionText}>
                        {navemon.description}
                    </p>
                </div> */}
                
                <div className={styles.actionButtons}>
                    <button 
                        className={styles.primaryButton}
                        onClick={changeMain}
                        disabled={current}
                    >
                        <FiStar />
                        {current ? "NAVEmon Principal" : "Tornar Principal"}
                    </button>
                    
                    <button 
                        className={styles.secondaryButton}
                        onClick={() => router.replace("/lista/")}
                    >
                        <FiArrowLeft />
                        Voltar para Lista
                    </button>
                </div>
            </div>

            {/* Modal para visualizar imagem em tamanho maior */}
            {isModalOpen && (
                <div className={styles.modal} onClick={handleModalClick}>
                    <div className={styles.modalContent}>
                        <button 
                            className={styles.closeButton}
                            onClick={closeModal}
                            aria-label="Fechar modal"
                        >
                            <FiX size={24} />
                        </button>
                        <img 
                            className={styles.modalImage}
                            src={`/artwork/${monsterId}.png`}
                            alt={navemon.name}
                        />
                        <div className={styles.modalInfo}>
                            <h3 className={styles.modalTitle}>{navemon.name}</h3>
                            <div className={styles.modalNumber}>
                                #{String(monsterId).padStart(3, '0')}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}