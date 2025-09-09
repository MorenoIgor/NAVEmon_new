"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { createUser } from "../databasefunctions"
import { useState } from "react"
import { FiUser, FiBook, FiCalendar, FiCheck } from "react-icons/fi"
import styles from "./CreateUser.module.css"

export default function CreateUserPage() {

    const {data: session, status} = useSession()
    const router = useRouter()
    const [selectedCourse, setSelectedCourse] = useState("")
    const [selectedYear, setSelectedYear] = useState("")
    const [error, setError] = useState("")

    async function startCreatingUser() {
        if (!selectedCourse || !selectedYear) {
            setError("Por favor, selecione seu curso e ano")
            return
        }

        try {
            let res = await createUser(
                {
                    name: session.user.name,
                    email: session.user.email,
                    course: selectedCourse,
                    monsters: selectedYear,
                    currentmonster: parseInt(selectedYear),
                }
            )

            router.push("/")
        } catch (err) {
            setError("Erro ao criar usuário. Tente novamente.")
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    <FiUser />
                    Criar Perfil
                </h1>
                <p className={styles.subtitle}>
                    Configure seu perfil para começar sua jornada NAVEmon
                </p>

                {/* Seleção de Curso */}
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>
                        <FiBook />
                        Qual é o seu curso?
                    </h2>
                    <div className={styles.optionsGrid}>
                        <div 
                            className={`${styles.optionCard} ${styles.courseMultimedia} ${selectedCourse === "MULT" ? styles.selected : ""}`}
                            onClick={() => setSelectedCourse("MULT")}
                        >
                            <img src={`/trainers/mm.png`} />
                            <div className={styles.optionTitle}>Multimídia</div>
                            <div className={styles.optionDescription}>
                                Design, criatividade e produção audiovisual
                            </div>
                        </div>
                        <div 
                            className={`${styles.optionCard} ${styles.courseProgramming} ${selectedCourse === "PROG" ? styles.selected : ""}`}
                            onClick={() => setSelectedCourse("PROG")}
                        >
                            <img src={`/trainers/prog.png`} />
                            <div className={styles.optionTitle}>Programação</div>
                            <div className={styles.optionDescription}>
                                Desenvolvimento de software e sistemas
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seleção de Ano */}
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>
                        <FiCalendar />
                        Em que ano você está?
                    </h2>
                    <div className={styles.yearOptions}>
                        <div 
                            className={`${styles.yearCard} ${selectedYear === "1" ? styles.selected : ""}`}
                            onClick={() => setSelectedYear("1")}
                        >
                            1º Ano
                        </div>
                        <div 
                            className={`${styles.yearCard} ${selectedYear === "2" ? styles.selected : ""}`}
                            onClick={() => setSelectedYear("2")}
                        >
                            2º Ano
                        </div>
                        <div 
                            className={`${styles.yearCard} ${selectedYear === "3" ? styles.selected : ""}`}
                            onClick={() => setSelectedYear("3")}
                        >
                            3º Ano
                        </div>
                    </div>
                </div>

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <button 
                    className={styles.createButton}
                    onClick={startCreatingUser}
                    disabled={!selectedCourse || !selectedYear}
                >
                    <FiCheck />
                    Criar Perfil
                </button>
            </div>
        </div>
    )

}