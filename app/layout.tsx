
import type { Metadata } from "next";

import { getSession } from "./auth"
import Providers from "./providers"
import { TopBar } from "./components/topbar";

import './globals.css'

import 'cirrus-ui';

export const metadata: Metadata = {
  title: "NAVEmon",
  description: "TESTE",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
      <html lang="en">
          <body>
              <Providers session={session}>
                  <TopBar />
                  <section className="section u-text-center">
                      <div className="content u-center">
                          {children}
                      </div>
                  </section>
              </Providers>
          </body>
      </html>
  )
}