'use client'

import { UserRepo } from '@/services/octokit/types'
import { Github, LayoutDashboard, Target } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { useFormState } from 'react-dom'
import CreateModalPortal from '../components/CreateProjectModal'
import { signInGithub, signOutGithub } from './_actions/auth'
import fetchUserRepos from './_actions/fetchUserRepos'

type NavItemLayoutProps = {
    title: string
    site: string
} & React.PropsWithChildren

// Turn this into a server component and move the CreateProjectModal elsewhere?

const NavItemLayout = ({ children, title, site }: NavItemLayoutProps) => {
    return (
        <li>
            <Link
                className="flex items-center p-2 text-gray-700 hover:text-gray-900 rounded-lg group"
                href={`/${site}`}
            >
                {children}
                <span className="ms-3">{title}</span>
            </Link>
        </li>
    )
}

export default function SideNavLayout() {
    const [show, setShow] = useState<boolean>(false)
    const { data: session } = useSession()
    const [state, fetchReposAction] = useFormState<UserRepo[] | null, FormData>(
        fetchUserRepos,
        null
    )

    return (
        <>
            <CreateModalPortal show={show} setShow={setShow} repos={state} />
            <div
                id="default-sidebar"
                className="top-0 left-0 z-40 h-screen bg-slate-50 font-medium border-r-2 
            border-slate-100 w-96"
                aria-label="Sidebar"
            >
                <div className="h-full overflow-y-auto">
                    <div className="grid grid-rows-8 w-full h-full">
                        <div className="flex flex-col justify-center items-center row-span-2 w-full h-full bg-slate-100">
                            <div>Project Showcase</div>
                        </div>
                        <div className="flex justify-center items-center row-span-5 h-full">
                            <ul className="space-y-4 h-full mt-10">
                                <NavItemLayout title="Projects" site="">
                                    <Target
                                        size={18}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 
                                    group-hover:text-gray-900"
                                    />
                                </NavItemLayout>
                                <NavItemLayout
                                    site="dashboard"
                                    title="Dashboard"
                                >
                                    <LayoutDashboard
                                        size={18}
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 
                                    group-hover:text-gray-900"
                                    />
                                </NavItemLayout>
                                {session && (
                                    <CreateProjectButton
                                        fetch={fetchReposAction}
                                        open={() => setShow(true)}
                                    />
                                )}
                            </ul>
                        </div>

                        <div className="flex flex-col justify-center items-center row-span-1">
                            <div className="border-t-2 py-4 border-slate-200 w-32"></div>
                            <div className="flex flex-col justify-center items-center h-full w-full mb-10">
                                {!session ? (
                                    <LoginWithGithubButton />
                                ) : (
                                    <LogoutButton />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export const LoginWithGithubButton = () => {
    return (
        <form action={signInGithub}>
            <button type="submit">
                <div
                    className="cursor-pointer flex justify-center items-center p-7 h-16 w-full bg-white border-2 border-slate-200 rounded-lg font-medium
            group hover:bg-slate-100"
                >
                    <Github className="mr-5" />
                    <span>Login with Github</span>
                </div>
            </button>
        </form>
    )
}

const LogoutButton = () => {
    return (
        <form action={signOutGithub}>
            <button type="submit">
                <div
                    className="cursor-pointer flex justify-center items-center p-7 h-16 w-full bg-white border-2 border-red-500 rounded-lg font-medium
            group hover:bg-red-100 mt-5"
                >
                    <Github color="red" className="mr-5" />
                    <span className="text-red-500">Logout</span>
                </div>
            </button>
        </form>
    )
}

const CreateProjectButton = ({
    open,
    fetch,
}: {
    open: () => void
    fetch: (payload: FormData) => void
}) => {
    // Fetch repos from GithubApp "on the server"

    return (
        <div id="open-modal-form">
            <form action={fetch} className="flex justify-center items-center">
                <button
                    type="submit"
                    onClick={open}
                    className="cursor-pointer inline-flex py-2 px-2.5 text-sm font-medium justify-center items-center bg-white border-2 border-blue-500 rounded-lg 
            group hover:bg-blue-100 text-blue-500 transition"
                >
                    Create Project
                </button>
            </form>
        </div>
    )
}
