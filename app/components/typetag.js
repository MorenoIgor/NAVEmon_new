import { FiSquare } from 'react-icons/fi'
import { FaSquare } from 'react-icons/fa'
import styles from './TypeTag.module.css'

export function TypeTag(props) {

    let types = props.typestring.split(",")

    // console.log(types)
    // array de tipos = ["BIO2", "HIS2", "ART1"]
    /*
    LEGENDA DOS TIPOS:
    BIO = Biologia
    HIS = História
    ART = Artes
    EDF = Educação Física
    MAT = Matemática
    QUI = Química
    GEO = Geografia
    ING = Inglês
    TEC = Técnico
    */
    const tiposConvertidos = types.map((tipo) => {
        // tipo é nome da disciplina e nivel de dificuldade]
        //switch case com .includes verificando a disciplina a partir da legenda
        switch (true) {
            case tipo.includes("BIO"):
                return "Biologia";
            case tipo.includes("HIS"):
                return "História";
            case tipo.includes("ART"):
                return "Artes";
            case tipo.includes("EDF"):
                return "Educação Física";
            case tipo.includes("MAT"):
                return "Matemática";
            case tipo.includes("QUI"):
                return "Química";
            case tipo.includes("GEO"):
                return "Geografia";
            case tipo.includes("ING"):
                return "Inglês";
            case tipo.includes("TEC"):
                return "Técnico";
            default:
                return "Outra";
        }
    })

    // Função para obter a classe CSS baseada no tipo
    const getTypeClass = (tipo) => {
        switch (true) {
            case tipo.includes("BIO"):
                return styles.typeBio;
            case tipo.includes("HIS"):
                return styles.typeHis;
            case tipo.includes("ART"):
                return styles.typeArt;
            case tipo.includes("EDF"):
                return styles.typeEdf;
            case tipo.includes("MAT"):
                return styles.typeMat;
            case tipo.includes("QUI"):
                return styles.typeQui;
            case tipo.includes("GEO"):
                return styles.typeGeo;
            case tipo.includes("ING"):
                return styles.typeIng;
            case tipo.includes("TEC"):
                return styles.typeTec;
            default:
                return styles.typeOther;
        }
    }

    const niveisDeDificuldade = types.map((tipo) => {
        // tipo é nome da disciplina e nivel de dificuldade
        //switch case com .includes verificando o nivel de dificuldade
        switch (true) {
            case tipo.includes("1"):
                return 1;
            case tipo.includes("2"):
                return 2;
            case tipo.includes("3"):
                return 3;
            default:
                return 0;
        }
    })

    // Função para renderizar os ícones de dificuldade
    const renderDifficultyIcons = (nivel) => {
        const icons = [];
        for (let i = 1; i <= 3; i++) {
            if (i <= nivel) {
                // Quadrado preenchido
                icons.push(
                    <FaSquare 
                        key={i} 
                        className={`${styles.difficultyIcon} ${styles.difficultyIconFilled}`}
                    />
                );
            } else {
                // Quadrado vazio
                icons.push(
                    <FiSquare 
                        key={i} 
                        className={`${styles.difficultyIcon} ${styles.difficultyIconEmpty}`}
                    />
                );
            }
        }
        return icons;
    }

    return (
        <div className={styles.tagContainer}>
            {
                tiposConvertidos.map((tp, index) => (
                    <div 
                        key={`${tp}-${index}`} 
                        className={`${styles.typeItem} ${getTypeClass(types[index])}`}
                    >
                        <span className={styles.typeName}>
                            {tp}
                        </span>
                        <div className={styles.difficultyContainer}>
                            {renderDifficultyIcons(niveisDeDificuldade[index])}
                        </div>
                    </div>
                ))
            }
        </div>
    )

}