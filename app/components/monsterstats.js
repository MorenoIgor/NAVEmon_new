import { useRouter } from "next/navigation"
import { TypeTag } from "./typetag"
import styles from './MonsterStats.module.css'

export function CaughtMonsterStats(props) {

    let router = useRouter()

    // Construir classes para a imagem
    const imageClasses = [styles.monsterImage]
    if (!props.caught) {
        imageClasses.push(styles.monsterImageSemiTransparent)
    }

    let star = ""
    if (props.current) {
        star += " ⭐"
    }

    return (
        <div 
            className={`${styles.monsterCard} ${props.current ? styles.rareCard : ''}`}
            onClick={() => {
                router.push("/navedex/" + props.monsterdata.id)   
            }}
        >
            {props.current && (
                <div className={styles.currentBadge}>
                    Ativo ⭐
                </div>
            )}
            <div className={styles.cardContainer}>
                <div className={styles.imageContainer}>
                    <img 
                        className={imageClasses.join(' ')} 
                        src={`/artwork/${props.monsterdata.id}.png`}
                        alt={props.monsterdata.name}
                    />
                </div>
            </div>
            <div className={styles.titleContainer}>
                <h6 className={styles.monsterName}>
                    {props.monsterdata.name + star}
                </h6>
                <TypeTag typestring={props.monsterdata.types} />
            </div>
        </div>
    )

}

export function WildMonsterStats(props) {

    let router = useRouter()

    function goCatch() {
        console.log(props.cancatch)
        if (props.cancatch==true) {
            router.push("/batalha/captura/"+props.monsterdata.id)
        } else {
            props.callback()
        }
    }

    return (
        <div 
            className={`${styles.monsterCard} ${styles.wildMonsterCard}`}
            onClick={() => {
                goCatch() 
            }}
        >
            <div className={styles.cardContainer}>
                <div className={`${styles.imageContainer} ${styles.wildImageContainer}`}>
                    <img 
                        className={styles.monsterImage} 
                        src={`/artwork/${props.monsterdata.id}.png`}
                        alt={props.monsterdata.name}
                    />
                </div>
            </div>
            <div className={styles.titleContainer}>
                <h6 className={styles.monsterName}>
                    {props.monsterdata.name}
                </h6>
                <TypeTag typestring={props.monsterdata.types} />
            </div>
        </div>
    )

}
