"use server"
import { authOptions } from "./auth"
import { getServerSession } from "next-auth/next"

import { redirect } from "next/navigation"

export default async function App() {

    const session = await getServerSession(authOptions)

    if (session==null) {
        redirect("/login")
    } else {
        redirect("/verify-user")
    }

    

}