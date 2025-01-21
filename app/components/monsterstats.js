import { useRouter } from "next/navigation"

export function CaughtMonsterStats(props) {

    let router = useRouter()

    let clsnm = "NAVEmonBadgeImage"
    if (!props.caught) {
        clsnm += " semiTransparent"
    }

    let star = ""
    if (props.current) {
        star += " ⭐"
    }

    return (
        <div className="listNAVEmonBadge" onClick={
            ()=> {
                router.push("/navedex/"+props.monsterdata.id)   
            }
        }>
            <h3>{props.monsterdata.name + star}</h3>
            <img className={clsnm} src={`/artwork/${props.monsterdata.id}.png`}></img>
        </div>
    )

}

export function WildMonsterStats(props) {

    let router = useRouter()

    let clsnm = "NAVEmonBadgeImage"

    let star = ""
    if (props.current) {
        star += " ⭐"
    }

    return (
        <div className="listNAVEmonBadge" onClick={
            ()=> {
                router.push("/batalha/captura/"+props.monsterdata.id)
            }
        }>
            <h3>{props.monsterdata.name + star}</h3>
            <img className={clsnm} src={`/artwork/${props.monsterdata.id}.png`}></img>
        </div>
    )

}
