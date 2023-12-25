import type { Metadata } from 'next'
import './globals.css'
import SideNavLayout from './Nav'
import Provider from './_util/Provider'
import { useAsyncAuth } from '@/hooks/useAsyncAuth'

export const metadata: Metadata = {
    title: 'Project Showcase',
}

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
                    <div className="flex w-screen h-screen">
                        <div id="modal" />
                        <SideNavLayout session={session} />
                        <div className="w-full h-full flex justify-center items-center bg-gradient-to-r from-slate-50 to-white">
                            {children}
                        </div>
                    </div>
                </Provider>
            </body>
        </html>
    )
}
