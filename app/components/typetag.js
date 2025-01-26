export function TypeTag(props) {

    let types = props.typestring.split(",")

    console.log(types)

    return (
        <div className="tag-container u-center m-4">
            {
                types.map(
                    (tp) => (
                        <div key={tp} className="tag tag--lg tag--info">{tp}</div>
                    )
                )
            }
        </div>
    )

}