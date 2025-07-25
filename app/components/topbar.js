"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useDarkMode } from "../hooks/useDarkMode"
import { useState } from "react"
import styles from './TopBar.module.css'
// Importando ícones corretos do React Icons
import { 
    FiCrosshair,     // Para capturar (câmera)
    FiList, 
    FiTarget, 
    FiSun, 
    FiMoon, 
    FiLogOut,
    FiHome,
    FiMenu,
    FiX
} from 'react-icons/fi'

export function TopBar() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { isDarkMode, toggleDarkMode } = useDarkMode()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    if (status === "loading") {
        return <div>Loading...</div>
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const handleNavigation = (path) => {
        router.push(path)
        setIsMobileMenuOpen(false)
    }

    return (
        <>
            <div className={`${styles.header} ${styles.unselectable} ${styles.headerAnimated} ${styles.desktopHeader}`}>
                <div className={styles.headerBrand}>
                    <div className={`${styles.navItem} ${styles.navItemNoHover}`}>
                        <h6 onClick={() => { router.replace("/") }} className={styles.title}>
                            <img src="/logo/logo.png" style={{ height: "70px", width: "auto", maxWidth: "fit-content" }} alt="NAVEmon Logo" />
                        </h6>
                    </div>
                </div>
                <div className={styles.headerNav}>
                    {session ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                                <div className={styles.navItem}>
                                    <button 
                                        onClick={() => router.push("/capturar")} 
                                        className={styles.navButton}
                                    >
                                        <FiCrosshair className={styles.icon} />
                                        Capturar
                                    </button>
                                </div>
                                <div className={styles.navItem}>
                                    <button 
                                        onClick={() => router.push("/lista")} 
                                        className={styles.navButton}
                                    >
                                        <FiList className={styles.icon} />
                                        Lista
                                    </button>
                                </div>
                                <div className={styles.navItem}>
                                    <button 
                                        onClick={() => router.push("/desafios")} 
                                        className={styles.navButton}
                                    >
                                        <FiTarget className={styles.icon} />
                                        Desafios
                                    </button>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                                <div className={styles.navItem}>
                                    <button 
                                        onClick={toggleDarkMode} 
                                        title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
                                        className={styles.navButton}
                                        style={{ padding: '8px' }}
                                    >
                                        {isDarkMode ? <FiSun className={styles.icon} /> : <FiMoon className={styles.icon} />}
                                    </button>
                                </div>
                                <div className={styles.navItem}>
                                    <button 
                                        onClick={() => {signOut()}} 
                                        className={`${styles.navButton} ${styles.logoutButton}`}
                                    >
                                        <FiLogOut className={styles.icon} />
                                        Sair
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div></div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={styles.navItem}>
                                    <button 
                                        onClick={toggleDarkMode} 
                                        title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
                                        className={styles.navButton}
                                        style={{ padding: '8px' }}
                                    >
                                        {isDarkMode ? <FiSun className={styles.icon} /> : <FiMoon className={styles.icon} />}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Header */}
            <div className={`${styles.header} ${styles.unselectable} ${styles.mobileHeader}`}>
                <div className={styles.mobileHeaderContent}>
                    <div className={styles.mobileLogo}>
                        <h6 onClick={() => { router.replace("/") }} className={styles.title}>
                            <img src="/logo/logo.png" style={{ height: "40pt" }} alt="NAVEmon Logo" />
                        </h6>
                    </div>
                    <button 
                        className={styles.mobileMenuToggle}
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? 
                            <FiX className={styles.iconXLarge} /> : 
                            <FiMenu className={styles.iconXLarge} />
                        }
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <>
                    <div 
                        className={styles.mobileMenuOverlay}
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>
                    <div className={styles.mobileMenu}>
                        {session ? (
                            <>
                                <button 
                                    onClick={() => handleNavigation("/capturar")} 
                                    className={styles.mobileMenuButton}
                                >
                                    <FiCrosshair className={styles.iconLarge} />
                                    Capturar
                                </button>
                                <button 
                                    onClick={() => handleNavigation("/lista")} 
                                    className={styles.mobileMenuButton}
                                >
                                    <FiList className={styles.iconLarge} />
                                    Lista
                                </button>
                                <button 
                                    onClick={() => handleNavigation("/desafios")} 
                                    className={styles.mobileMenuButton}
                                >
                                    <FiTarget className={styles.iconLarge} />
                                    Desafios
                                </button>
                                <button 
                                    onClick={() => {
                                        toggleDarkMode()
                                        setIsMobileMenuOpen(false)
                                    }} 
                                    className={styles.mobileMenuButton}
                                >
                                    {isDarkMode ? <FiSun className={styles.iconLarge} /> : <FiMoon className={styles.iconLarge} />}
                                    {isDarkMode ? "Modo Claro" : "Modo Escuro"}
                                </button>
                                <button 
                                    onClick={() => {
                                        signOut()
                                        setIsMobileMenuOpen(false)
                                    }} 
                                    className={`${styles.mobileMenuButton} ${styles.mobileMenuButtonLogout}`}
                                >
                                    <FiLogOut className={styles.iconLarge} />
                                    Sair
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => {
                                    toggleDarkMode()
                                    setIsMobileMenuOpen(false)
                                }} 
                                className={styles.mobileMenuButton}
                            >
                                {isDarkMode ? <FiSun className={styles.iconLarge} /> : <FiMoon className={styles.iconLarge} />}
                                {isDarkMode ? "Modo Claro" : "Modo Escuro"}
                            </button>
                        )}
                    </div>
                </>
            )}
        </>
    )
}