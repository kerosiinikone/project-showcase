import { useAsyncAuth } from '@/services/auth/util/useAsyncAuth'
import { Inter as FontSans } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SideNavLayout, { HiddenSideNavDrawer } from './Nav'
import Provider from './_util/Provider'
import './globals.css'
import { cn } from '@/lib/utils'

const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
})

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await useAsyncAuth()

    return (
        <html lang="en">
            <body
                style={{
                    overflowX: 'hidden',
                }}
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    fontSans.variable
                )}
            >
                {process.env.ENVIRONMENT === 'test' && (
                    <pre className="session">
                        {JSON.stringify(session)}
                    </pre>
                )}
                <Provider>
                    <HiddenSideNavDrawer session={session} />
                    <div className="md:h-screen h-full w-screen flex flex-row items-center justify-center">
                        <div id="modal" />
                        <SideNavLayout session={session} />
                        <div className="md:h-full w-full flex justify-center items-center bg-gradient-to-r from-slate-50 to-white">
                            {children}
                        </div>
                    </div>
                </Provider>
                <ToastContainer />
            </body>
        </html>
    )
}
