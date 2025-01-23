"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { createUser } from "../databasefunctions"

export default function CreateUserPage() {

    const {data: session, status} = useSession()
    const router = useRouter()

    async function startCreatingUser() {

        let course = document.querySelector("#course").value
        let navemon = document.querySelector("#navemon").value

        let res = await createUser(
            {
                name: session.user.name,
                email: session.user.email,
                course: course,
                monsters: navemon,
                currentmonster: parseInt(navemon),
            }
        )

        router.push("/")

    }

    return (

        <div>
            <select id="course">
                <option value="MULT">Multimídia</option>
                <option value="PROG">Programação</option>
            </select>
            <select id="navemon">
                <option value="1">Primeiro</option>
                <option value="2">Segundo</option>
                <option value="3">Terceiro</option>
            </select>
            <button className="m-4"  onClick={()=>startCreatingUser()}>Criar</button>
        </div>

    )

}