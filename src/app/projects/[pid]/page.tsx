import { useAsyncAuth } from '@/hooks/useAsyncAuth'
import { ProjectWithUser } from '@/models/Project/types'

import { getProjectServer } from '@/services/trpc/server'
import { Github, Pencil, UserPlus } from 'lucide-react'

interface ProjectComponentProps {
    params: { pid: string }
}

// Abstract into Components

export default async function ProjectComponent({
    params,
}: ProjectComponentProps) {
    // Cache
    const {
        project: { id: pid, name, stage, description, github_url, author_id },
        user,
    } = (await getProjectServer({
        id: params.pid,
        joinUsers: true,
    })) as ProjectWithUser

    const session = await useAsyncAuth()

    return (
        <div className="container h-screen w-screen flex justify-center items-center p-10">
            <div className="flex flex-col justify-start h-full w-full rounded-xl bg-white border-stone-100 border-2 shadow-lg">
                <div className="flex flex-row w-full justify-between p-10">
                    <div className="flex flex-col w-2/3">
                        <h1 className="font-medium truncate text-3xl">
                            {name}
                        </h1>
                        <h2 id="status" className="text-xl mt-5">
                            {stage}
                        </h2>
                    </div>
                    {session && (
                        <div className="flex flex-row gap-2 w-fit justify-center items-center">
                            {session.user.id == author_id && <EditButton />}
                            <SupportButton id={pid} />
                        </div>
                    )}
                </div>
                <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-row border-t-2 w-full p-10">
                        <h2 className="font-normal text-wrap w-1/2 truncate text-xl">
                            {description}
                        </h2>
                    </div>
                    <div className="flex flex-row justify-between w-full p-10 border-t-2 border-stone-100">
                        <div className="flex flex-col w-2/3">
                            <span className="font-medium text-2xl">Author</span>
                            <span className="font-normal text-xl">
                                {user.name}
                            </span>
                            <span className="font-light">{user.id}</span>
                        </div>
                        {github_url && (
                            <div
                                id="github-icon"
                                className="flex flex-col w-fit justify-center items-center cursor-pointer"
                            >
                                <a href={github_url}>
                                    <Github size="30" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const SupportButton = async ({ id }: { id: string }) => {
    async function supportProject(formData: FormData) {
        'use server'
        // Add projectId to session user's projects list
        // Add session user's id to project's supporters list
    }

    return (
        <form action={supportProject}>
            <div className="flex justiyf-center items-center">
                <button
                    type="submit"
                    className="cursor-pointer inline-flex py-4 px-6 text-sm font-medium justify-center items-center bg-white border-2 border-blue-500 rounded-lg 
            group hover:bg-blue-100 text-blue-500 transition"
                >
                    <UserPlus
                        className="w-5 h-5 me-2"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 22 24"
                    />
                    Support Project
                </button>
            </div>
        </form>
    )
}

const EditButton = () => {
    // Opens a modal to edit the project -> redirects to the project page

    return (
        <div className="flex justiyf-center items-center">
            <button
                type="submit"
                className="cursor-pointer inline-flex py-4 px-6 text-sm font-medium justify-center items-center bg-white border-2 border-emerald-500 rounded-lg 
            group hover:bg-emerald-100 text-emerald-500 transition"
            >
                <Pencil
                    className="w-5 h-5 me-2"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 22 24"
                />
                Edit
            </button>
        </div>
    )
}