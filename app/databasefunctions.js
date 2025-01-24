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

export async function getUserData(email) {

    dailyReset()

    return await prisma.user.findFirst(
        {
            where: {email: email}
        }
    )

}

export async function getUserWinLoseDraw(userid) {

    return await prisma.user.findFirst(
        {
            where: {id: userid},
            select: {
                wins: true,
                losses: true,
                draws: true
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

    await writeUserDataById(me.id, {
        challenges: parseInt(me.challenges) - 1
    })

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

export async function getChallengesReceived(email) {

    let iddata = await prisma.user.findFirst(
        {
            where: {
                email: email
            },
            select: {
                id: true
            }
        }
    )

    return await prisma.battle.findMany(
        {
            where: {
                    player2id: parseInt(iddata.id),
                    NOT: {
                        status: "FINISHED"
                      }
            },
            select: {
                id: true,
                player1name: true,
                player1monster: true
            }
        }
    )
}

export async function getChallengesMade(email) {

    let iddata = await prisma.user.findFirst(
        {
            where: {
                email: email
            },
            select: {
                id: true
            }
        }
    )

    return await prisma.battle.findMany(
        {
            where: {
                    player1id: parseInt(iddata.id),
                    NOT: {
                        status: "FINISHED"
                      }
            },
            select: {
                id: true,
                player2name: true,
                player2monster: true
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

export async function writeUserDataById(userid,data) {

    await prisma.user.update(
        {
            where: {
                id: userid
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

export async function resolveBattle(bd) {

    let p1count = 0
    let p2count = 0
    let p1arr = bd.player1answers.split(",")
    let p2arr = bd.player2answers.split(",")

    for (let i=0;i<5;i++) {
        p1count += parseInt(p1arr[i])
        p2count += parseInt(p2arr[i])
    }

    let winner
    if (p1count>p2count) {
        winner = 1
    } else if (p2count>p1count) {
        winner = 2
    } else {
        winner = 0
    }

    let data = {
        status: "FINISHED"
    }

    let _bd = await writeBattleData(parseInt(bd.id),data)


    let pd1 = await getUserWinLoseDraw(parseInt(bd.player1id))
    let pd2 = await getUserWinLoseDraw(parseInt(bd.player1id))

    if (winner == 1) {
        await writeUserDataById(parseInt(bd.player1id),
        {
            wins: parseInt(pd1.wins) + 1
        })
        await writeUserDataById(parseInt(bd.player2id),
        {
            losses: parseInt(pd2.losses) + 1
        })
    } else if (winner==2) {
        await writeUserDataById(parseInt(bd.player1id),
        {
            losses: parseInt(pd1.losses) + 1
        })
        await writeUserDataById(parseInt(bd.player2id),
        {
            wins: parseInt(pd2.wins) + 1
        })
    } else {
        await writeUserDataById(parseInt(bd.player1id),
        {
            draws: parseInt(pd1.draws) + 1
        })
        await writeUserDataById(parseInt(bd.player2id),
        {
            draws: parseInt(pd2.draws) + 1
        })
    }

    let ret = bd

    ret.status = "FINISHED"

    console.log(ret)

    return ret

  }

 export async function reduceCatches(email) {

    let data = await prisma.user.findFirst(
        {
            where: {
                email: email
            },
            select: {
                catches: true
            }
        }
    )

    let c = parseInt(data.catches)-1
    if (c<0) c = 0

    await prisma.user.update(
        {
            where: {
                email: email
            },
            data: 
            {
                catches: c
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
                monsters: true,
                catches: true
            }
        }
    )

    let data2 = {}

    let monsters = data.monsters
    let newmonsters = monsters + `,${navemon}`

    data2.monsters = newmonsters


        await prisma.user.update(
            {
                where: {
                    email: email
                },
                data: data2
            }
        )

}

async function dailyReset() {

    const timestamp = Date.now() - 10800000;
    const currentDate = new Date(timestamp);
    const dayOfMonth = currentDate.getDate();

    let day = await prisma.admin.findFirst(
        {
            where: {
                id: 1
            },
            select: {
                currentday: true
            }
        }
    )

    if (parseInt(day.currentday)!=dayOfMonth) {
        await resetCatchesAndChallenges()
        await prisma.admin.update(
            {
                where: {
                    id: 1
                },
                data: {
                    currentday: dayOfMonth
                }
            }
        )
    }

}

async function resetCatchesAndChallenges() {

    await prisma.user.updateMany({
        where: {
          email: {
            contains: '@',
          },
        },
        data: {
          catches: 3,
          challenges: 1
        },
      })

}