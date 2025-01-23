"use client"

import { useRouter } from "next/navigation"

export function TopBar() {

    const router = useRouter()

    return (
        <div className="header unselectable header-animated">
        <div className="header-brand">
           <div className="nav-item no-hover">
              <h6 onClick={()=> {router.replace("/")}} className="title"><img src="/logo/logo.png" style={{height: "48pt"}} /></h6>
           </div>
        </div>
        </div>
    )

}