import './globals.css'
import SideNavLayout from './Nav'
import Provider from './_util/Provider'
import { SessionProvider } from 'next-auth/react'
import { useAsyncAuth } from '@/services/auth/util/useAsyncAuth'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await useAsyncAuth()

    return (
        <html lang="en">
            <body>
                <Provider>
                    <div className="flex h-screen">
                        <div id="modal" />
                        <SideNavLayout session={session} />
                        <div className="w-full h-full flex justify-center items-center bg-gradient-to-r from-slate-50 to-white">
                            {children}
                        </div>
                    </div>
                </Provider>
                <ToastContainer />
            </body>
        </html>
    )
}
