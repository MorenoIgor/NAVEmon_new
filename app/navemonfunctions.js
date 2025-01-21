import { NAVEmon } from "../data/navemon"
import { questions } from "../data/questions"

export function getNAVEmon(monsterid) {

    return NAVEmon[monsterid]
}

export function getNAVEmonTypes(monsterid) {

    return NAVEmon[monsterid].types
}