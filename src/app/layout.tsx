import './globals.css'
import SideNavLayout from './Nav'
import Provider from './_util/Provider'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/services/auth'

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    return (
        <html lang="en">
            <body>
                <SessionProvider session={session}>
                    <Provider>
                        <div className="flex h-screen">
                            <div id="modal" />
                            <SideNavLayout />
                            <div className="w-full h-full flex justify-center items-center bg-gradient-to-r from-slate-50 to-white">
                                {children}
                            </div>
                        </div>
                    </Provider>
                </SessionProvider>
            </body>
        </html>
    )
}
