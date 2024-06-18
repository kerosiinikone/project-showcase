'use client'

import fetchUserRepos from '@/app/_actions/fetch-user-repos-action'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { ProjectWithUser } from '@/models/Project/types'
import { Github, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import deleteProjectAction from '../_actions/delete-project-action'
import supportProjectAction from '../_actions/follow-project-action'
import unsupportProjectAction from '../_actions/unfollow-project-action'
import Markdown from './Markdown'
import DeleteButton from './ui/DeleteButton'
import EditButton from './ui/EditButton'
import SupportButton from './ui/SupportButton'
import editProjectAction from '../_actions/edit-project-action'
import { toast } from 'react-toastify'
import CreateModalLayout from '@/components/CreateModal'

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
    project,
    readme,
    isFollowed,
}: ProjectWrapperProps) {
    const {
        name,
        stage,
        website,
        description,
        author_id,
        id,
        author,
        tags,
        github_url,
    } = project

    const [isDelete, setIsDelete] = useState<boolean>(false)
    const [actionLoading, setActionLoading] = useState<boolean>(false)

    const [repoState, fetchReposAction] = useFormState(
        fetchUserRepos,
        null
    )
    const [editState, editAction] = useFormState(editProjectAction, {
        done: false,
        pid: id,
        author_id,
    })
    const [isFollowedState, setIsFollowedState] =
        useState<boolean>(isFollowed)
    const [_, deleteAction] = useFormState(deleteProjectAction, {
        done: false,
        pid: id,
        author_id,
    })

    const unsupportWithParams = unsupportProjectAction.bind(null, id)
    const supportWithParams = supportProjectAction.bind(null, id)

    useEffect(() => {
        setActionLoading(false)

        if (editState?.error) {
            toast('Error', {
                position: 'bottom-center',
                autoClose: 5000,
                type: 'error',
                hideProgressBar: true,
                closeOnClick: true,
                progress: undefined,
                theme: 'colored',
            })
        }
    }, [editState])

    return (
        <div className="flex flex-col justify-center shrink space-y-6 w-full h-full p-6 pt-20 md:pt-15 2xl:pt-10">
            <div className="flex flex-col xl:w-fit w-full shadow-lg border-2 flex-shrink rounded-xl p-6">
                <div className="flex 2xl:flex-row flex-col w-full gap-8 md:justify-between justify-center md:items-start 2xl:items-center items-center p-10">
                    <div className="flex flex-col w-full md:items-start items-center justify-center gap-2">
                        <div className="flex flex-row w-fit justify-center items-center gap-5">
                            <div className="flex flex-row gap-2">
                                {stage}
                            </div>
                            <div className="flex flex-col text-2xl w-full">
                                {name}
                            </div>
                        </div>
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
                    <div className="flex flex-row gap-2 items-center justify-center">
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
                                    <Dialog>
                                        <CreateModalLayout
                                            prefill={{
                                                name,
                                                description,
                                                github_url,
                                                stage,
                                                website,
                                                tags,
                                            }}
                                            dispatch={editAction}
                                            actionLoading={
                                                actionLoading
                                            }
                                            setActionLoading={
                                                setActionLoading
                                            }
                                            action="Edit"
                                            title="Edit Project"
                                            subTitle="An existing project"
                                            repos={
                                                repoState?.data ?? []
                                            }
                                            initialTags={tags}
                                        />
                                        <EditButton
                                            fetch={fetchReposAction}
                                        />
                                    </Dialog>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="shadow-lg border-2 flex-shrink rounded-xl p-6">
                <div className="mb-5">
                    <div className="font-medium text-xl">Details</div>
                </div>
                <div className="flex flex-col">
                    <div className="flex lg:flex-row items-start flex-col gap-4">
                        <div className="flex flex-col items-start h-full xl:w-1/2 w-full rounded-md border p-4">
                            <div className="h-full">
                                <p className="text-sm font-medium leading-none mb-4">
                                    Description
                                </p>
                                <p className="font-normal w-full text-wrap truncate text-md overflow-hidden truncate break-words">
                                    {description}
                                </p>
                            </div>
                            {tags && (
                                <div className="flex flex-row gap-4 h-full w-full py-4">
                                    {tags.map((t) => {
                                        return (
                                            <div
                                                className="mt-2"
                                                key={t}
                                            >
                                                <Link
                                                    href={`/?tag=${t}`}
                                                >
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

                        {readme && (
                            <div className="flex flex-col h-3/4 xl:w-1/2 w-full w-full items-start justify-center space-y-4 rounded-md border p-4">
                                <p className="text-sm font-medium leading-none">
                                    README
                                </p>
                                <div className="w-full h-3/4">
                                    <Markdown readme={readme} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="shadow-lg border-2 flex-shrink rounded-xl p-6">
                <div className="mb-5">
                    <div className="font-medium text-xl">Author</div>
                </div>
                <div className="flex flex-row justify-between space-x-4 w-full h-fit">
                    <div className="flex flex-col w-2/3">
                        <span className="font-normal text-xl">
                            {author.name}
                        </span>
                        <span className="font-light md:text-md text-sm w-3/4">
                            {author.id}
                        </span>
                    </div>
                    <div className="flex md:flex-row flex-col md:items-center md:justify-center gap-4">
                        {supportCountFormatted && (
                            <div className="flex flex-row gap-2 mx-5 justify-center items-center">
                                <h2 className="text-lg font-medium">
                                    {supportCountFormatted == 1
                                        ? `${supportCountFormatted}`
                                        : `${supportCountFormatted}`}
                                </h2>
                                <User />
                            </div>
                        )}
                        {github_url && (
                            <div
                                id="github-icon"
                                className="flex flex-col w-fit h-fit p-2 justify-center items-center cursor-pointer border-2 border-black rounded-md hover:bg-gray-300 transition"
                            >
                                <a
                                    href={github_url}
                                    rel="noreferrer"
                                    target="_blank"
                                >
                                    <Github size="20" />
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
                                    supportWithParams={
                                        supportWithParams
                                    }
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
        </div>
    )
}
