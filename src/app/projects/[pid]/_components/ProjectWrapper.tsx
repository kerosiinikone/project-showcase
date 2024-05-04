'use client'

import { ProjectWithUser } from '@/models/Project/types'
import { Github } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useFormState } from 'react-dom'
import deleteProjectAction from '../_actions/delete-project-action'
import supportProjectAction from '../_actions/follow-project-action'
import unsupportProjectAction from '../_actions/unfollow-project-action'
import Markdown from './Markdown'
import DeleteButton from './ui/DeleteButton'
import EditButton from './ui/EditButton'
import SupportButton from './ui/SupportButton'

// TODO: Divide the component into smaller chunks

interface ProjectWrapperProps {
    session: any
    isFollowed: boolean
    project: ProjectWithUser & { id: number }
    readme?: string | null
    supportCountFormatted: string | number | null
}

export default function ProjectWrapper({
    session,
    supportCountFormatted,
    project: {
        name,
        stage,
        author,
        tags,
        id,
        website,
        description,
        github_url,
        author_id,
    },
    readme,
    isFollowed,
}: ProjectWrapperProps) {
    const [isDelete, setIsDelete] = useState<boolean>(false)
    const [isFollowedState, setIsFollowedState] =
        useState<boolean>(isFollowed)
    const [_, deleteAction] = useFormState(deleteProjectAction, {
        done: false,
        pid: id,
        author_id,
    })

    const unsupportWithParams = unsupportProjectAction.bind(null, id)
    const supportWithParams = supportProjectAction.bind(null, id)

    return (
        <div className="flex flex-col justify-start h-full w-full rounded-xl bg-white border-stone-100 border-2 shadow-lg">
            <div className="flex flex-col justify-start h-full w-full">
                <div className="flex flex-row w-full justify-between p-10">
                    <div className="flex flex-col w-2/3">
                        <div className="flex w-full h-full items-center gap-6">
                            <h1 className="font-medium truncate text-3xl">
                                {name}
                            </h1>
                            {website && (
                                <a
                                    className="group"
                                    href={website}
                                    target="__blank"
                                >
                                    <h2 className="truncate text-xl text-slate-600 cursor-pointer group-hover:text-slate-900 transition">
                                        {website}
                                    </h2>
                                </a>
                            )}
                        </div>

                        <h2 id="status" className="text-xl mt-5">
                            {stage}
                        </h2>
                    </div>
                    <div className="flex flex-row gap-2">
                        {session && (
                            <div className="flex flex-row gap-2 w-fit justify-center items-center">
                                <form
                                    action={
                                        isDelete
                                            ? deleteAction
                                            : undefined
                                    }
                                    className="flex flex-row gap-2 w-fit justify-center items-center"
                                >
                                    {session.user?.id ==
                                        author.id && (
                                        <DeleteButton
                                            setIsDelete={setIsDelete}
                                            isDelete={isDelete}
                                        />
                                    )}
                                </form>
                            </div>
                        )}
                        {session && (
                            <div className="flex flex-row gap-2 w-fit justify-center items-center">
                                <div className="flex flex-row gap-2 w-fit justify-center items-center">
                                    {session.user?.id ==
                                        author.id && (
                                        <EditButton pid={id} />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-row border-t-2 gap-4 h-full w-full p-10">
                    <div className="h-full w-full">
                        <h1 className="p-2 mb-2 text-xl">
                            Description
                        </h1>
                        <div className="h-3/4 w-full p-5 border-2 border-stone-300 rounded-xl">
                            <h2 className="font-normal text-wrap truncate text-xl">
                                {description}
                            </h2>
                        </div>
                    </div>

                    {readme && (
                        <div className="h-full w-full">
                            <h1 className="p-2 mb-2 text-xl">
                                README.md
                            </h1>
                            <div className="w-full h-3/4 border-2 p-5 border-stone-300 rounded-xl">
                                <Markdown readme={readme} />
                            </div>
                        </div>
                    )}
                </div>
                {tags && (
                    <div className="flex flex-row gap-4 h-full w-full px-10 py-4">
                        {tags.map((t) => {
                            return (
                                <div className="mt-2" key={t}>
                                    <Link href={`/?tag=${t}`}>
                                        <div className="flex items-center justify-center gap-2 flex-row w-max py-2 px-3 bg-blue-600 rounded-xl cursor-pointer hover:bg-blue-800 tansition">
                                            <h2 className="text-white font-medium text-sm">
                                                {t}
                                            </h2>
                                        </div>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            <div className="flex flex-row justify-between w-full p-10 border-t-2 border-stone-100">
                <div className="flex flex-col w-2/3">
                    <span className="font-medium text-2xl">
                        Author
                    </span>
                    <span className="font-normal text-xl">
                        {author.name}
                    </span>
                    <span className="font-light">{author.id}</span>
                </div>
                <div className="flex flex-row items-center gap-6">
                    {supportCountFormatted && (
                        <div>
                            <h2 className="mx-5 text-lg font-medium">
                                {supportCountFormatted == 1
                                    ? `${supportCountFormatted} supporter`
                                    : `${supportCountFormatted} supporters`}
                            </h2>
                        </div>
                    )}
                    {github_url && (
                        <div
                            id="github-icon"
                            className="flex flex-col w-fit h-fit p-2 justify-center items-center cursor-pointer border-2 border-black rounded-md hover:bg-gray-300 transition"
                        >
                            <a href={github_url} target="_blank">
                                <Github size="30" />
                            </a>
                        </div>
                    )}

                    {session && (
                        <div className="flex flex-row gap-2 w-fit justify-center items-center">
                            <SupportButton
                                isFollowed={isFollowedState}
                                unsupportWithParams={
                                    unsupportWithParams
                                }
                                supportWithParams={supportWithParams}
                                setIsFollowedState={
                                    setIsFollowedState
                                }
                                pid={id}
                                uid={session.user!.id}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
