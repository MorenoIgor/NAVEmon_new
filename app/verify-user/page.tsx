"use server"

import prisma from "../database";
import { userAlreadyExists, createUser } from "../databasefunctions";

import { authOptions } from "../auth"
import { getServerSession } from "next-auth/next"

import { redirect } from "next/navigation"

export default async function VerifyUser() {

    const session = await getServerSession(authOptions)

    let userExists = await userAlreadyExists(session.user.email)


    if (userExists==null) {
        redirect("/create-user")
    } else {
        redirect("/inicio")
    }

    

}