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
        // <div className="listNAVEmonBadge" onClick={
        //     ()=> {
        //         router.push("/navedex/"+props.monsterdata.id)   
        //     }
        // }>
        //     <h3>{props.monsterdata.name + star}</h3>
        //     <img className={clsnm} src={`/artwork/${props.monsterdata.id}.png`}></img>
        // </div>

        <div className="card" style={{width: "200pt", margin: "6pt"}} onClick={
                ()=> {
                    router.push("/navedex/"+props.monsterdata.id)   
                }
            } >
        <div className="card__container">
        <div className="content u-text-center pt-3">
            <img className={clsnm} src={`/artwork/${props.monsterdata.id}.png`}></img>
        </div>
        </div>
        <div className="card__title-container u-text-center">
            <h4>{props.monsterdata.name + star}</h4>
        </div>
        </div>
    )

}

export function WildMonsterStats(props) {

    let router = useRouter()

    let clsnm = "NAVEmonBadgeImage"

    function goCatch() {
        console.log(props.cancatch)
        if (props.cancatch==true) {
            router.push("/batalha/captura/"+props.monsterdata.id)
        } else {
            props.callback()
        }
    }

    return (
        // <div className="listNAVEmonBadge" onClick={
        //     ()=> {
        //         goCatch()
        //     }
        // }>
        //     <h3>{props.monsterdata.name + star}</h3>
        //     <img className={clsnm} src={`/artwork/${props.monsterdata.id}.png`}></img>
        // </div>
        <div className="card" style={{margin: "6pt"}} onClick={
            ()=> {
                goCatch() 
            }
        } >
        <div className="card__container">
            <div className="content u-text-center pt-3">
        <img className={clsnm} src={`/artwork/${props.monsterdata.id}.png`}></img>
            </div>
        </div>
        <div className="card__title-container u-text-center">
            <h4>{props.monsterdata.name}</h4>
        </div>
        </div>
    )

}
