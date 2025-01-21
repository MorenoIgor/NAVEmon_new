import { questions } from "@/data/questions"

export function QuestionBlock(typeLevelString,number) {

    let types = typeLevelString.split(",")
    let typeLevelObject

    if (types.length==2) {
        typeLevelObject = {
            type1: types[0].substring(0,3),
            level1: types[0].charAt(3),
            
            type2:types[1].substring(0,3),
            level2: types[1].charAt(3)
        }
    } else {
        typeLevelObject = {
            type1: types[0].substring(0,3),
            level1: types[0].charAt(3),
            
            type2:types[0].substring(0,3),
            level2: types[0].charAt(3)
        }
        //HACKY AS FUCK
    }

    let questionList = getQuestionList(typeLevelObject)

    let questionBlock = getQuestionBlock(questionList,number)

    return questionBlock
}

export function getQuestionList(typeLevelObject) {

    let list = []

    for (let q of questions) {

        if ((q.type==typeLevelObject.type1 && parseInt(q.level)<=parseInt(typeLevelObject.level1)) || (q.type == typeLevelObject.type2 && parseInt(q.level)<=parseInt(typeLevelObject.level2)) ) {
            list.push(q)
        }

    }

    return list

}

export function getQuestionBlock(questionList,number) {

    let ql = []
    let exclude = []
    let selected = []
    let questionBlock = []
    let length = questionList.length

    for (let q of questionList) {
        ql.push(q.id)
    }

    for (let i=0;i<parseInt(number);i++) {
       let chosen
       let ok = false 
       while (ok==false) {
        chosen = Math.floor(Math.random() * length)
        if (!selected.includes(ql[chosen])) {
            ok = true
        }
       }
       selected.push(ql[chosen])
    }

    for (let qq=0;qq<selected.length;qq++) {

        questionBlock.push(questions[selected[qq]])

    }

    return questionBlock

}