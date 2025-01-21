"use server"

import prisma from "./database"

import { NAVEmon } from "../data/navemon"
import { questions } from "../data/questions"

export async function userAlreadyExists(userEmail) {

    let result = await prisma.user.findFirst(
        {
            where: {email: userEmail},
            select: {
                id: true
            }
        }
    )

    return result

}

export async function createUser(userObj) {

    let result = await prisma.user.create(
        {
            data: userObj
        }
    )

    return result

}

export async function getUserName(userid) {

    return await prisma.user.findFirst(
        {
            where: {id: userid},
            select: {
                name: true
            }
        }
    )

}

export async function getUserId(email) {

    return await prisma.user.findFirst(
        {
            where: {email: email},
            select: {
                id: true
            }
        }
    )

}

export async function getUserMonsters(email) {

    return await prisma.user.findFirst(
        {
            where: {email: email},
            select: {
                monsters: true,
                currentmonster: true
            }
        }
    )

}

export async function getUserCurrentMonster(email) {

    return await prisma.user.findFirst(
        {
            where: {email: email},
            select: {
                currentmonster: true
            }
        }
    )

}

export async function getChallenges(email,mode) {

    let chal_rec = true
    let chal_mad = false

    if (mode=="made") {
        chal_rec = false
        chal_mad = true
    }

    return await prisma.user.findFirst(
        {
            where: {
                email: email,
            },
                select: {
                    challenges_received: chal_rec,
                    challenges_made: chal_mad
                }
            }
    )

}

export async function startBattle(useremail,otheremail) {

    let other = await prisma.user.findFirst(
        {
            where: {
                email: otheremail
            }
        }
    )

    if (other==null) return null

    let me = await prisma.user.findFirst(
        {
            where: {
                email: useremail
            }
        }
    )

    let battle = await prisma.battle.create(
        {
            data: {
                player1id: me.id,
                player1name: me.name,
                player1monster: me.currentmonster,
                player1answers: "",

                player2id: other.id,
                player2name: other.name,
                player2monster: other.currentmonster,
                player2answers: "",
            }
        }
    )

    await addBattleToUser(other.id,battle.id,"received")
    await addBattleToUser(me.id,battle.id,"made")

    return battle

}

export async function addBattleToUser(user,battleid,mode) {

    console.log("BID:   ",battleid)

    let selectobj = {
        challenges_received: true
    }
    if (mode=="made") {
        selectobj = {
            challenges_made: true
        }
    }

    let bs = await prisma.user.findFirst(
        {
            where: {
                id: user
            },
            select: selectobj
        }
    )

    let battlestring

    if (mode=="received") {
        battlestring = bs.challenges_received
    } else {
        battlestring = bs.challenges_made
    }

    battlestring += battleid.toString()+","

    let dataobj = {
        challenges_received: battlestring
    }
    if (mode=="made") {
        dataobj = {
            challenges_made: battlestring
        }
    }

    await prisma.user.update(
        {
            where: {
                id: user
            },
            data: dataobj
        }

    )

}


export async function getBattleDataById(battleid) {
    
    return await prisma.battle.findFirst(
        {
            where: {
                id: battleid
            }
        }
    )
}

export async function checkBattleDone(battleid) {

    let data = await prisma.battle.findFirst(
        {
            where: {
                        id: battleid
                    }
            }
    )

    if (data.player1answers=="" || data.player2answers=="") {
        return false
    } else {
        return true
    }
}

export async function getBattleData(userid,otherid) {

    return await prisma.battle.findFirst(
        {
            where: {
                OR: [
                    {
                        player1id: userid,
                        player2id: otherid
                    },
                    {
                        player1id: otherid,
                        player2id: userid
                    }
                ]
            }
        }
    )
}

export async function writeBattleData(battleid,data) {

    await prisma.battle.update(
        {
            where: {
                id: battleid
            },
            data: data
        }
    )
}

export async function setCurrentNAVEmon(email,monsterid) {

    return await prisma.user.update(
        {
            where: {
                email: email
            },
            data: {
                currentmonster: monsterid
            }
        }
    )

}

export async function catchNAVEmon(email,navemon) {

    let data = await prisma.user.findFirst(
        {
            where: {
                email: email
            },
            select: {
                monsters: true
            }
        }
    )

    console.log(data)

    let monsters = data.monsters
    let newmonsters = monsters + `,${navemon}`

    await prisma.user.update(
        {
            where: {
                email: email
            },
            data: {
                monsters: newmonsters
            }
        }
    )
}