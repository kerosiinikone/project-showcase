'use client'

import { ProjectWithUser, Stage } from '@/models/Project/types'
import { Github, Pencil, UserPlus } from 'lucide-react'
import { Session } from 'next-auth/types'
import { useFormState } from 'react-dom'
import supportProjectAction from '../_actions/follow-project-action'
import { Dispatch, SetStateAction, useState } from 'react'
import editProjectAction from '../_actions/edit-project-action'
import unsupportProjectAction from '../_actions/unfollow-project-action'

interface ProjectWrapperProps {
    session: Session | null
    isFollowed: boolean
    project: ProjectWithUser
}

interface SupportButtonProps {
    uid: string
    pid: string
    isFollowed: boolean
    follow: (payload: FormData) => void
    unfollow: (payload: FormData) => void
    setIsFollowedState: Dispatch<SetStateAction<boolean>>
}

export default function ProjectWrapper({
    session,
    project,
    isFollowed,
}: ProjectWrapperProps) {
    // Get the "isFollowed" from server later
    // Add "unsupport" logic
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const { name, stage, author, id, description, github_url } =
        project
    const [isFollowedState, setIsFollowedState] =
        useState<boolean>(isFollowed)

    const [_, follow] = useFormState(supportProjectAction, null)
    const [__, unfollow] = useFormState(unsupportProjectAction, null)

    return (
        <div className="flex flex-col justify-start h-full w-full rounded-xl bg-white border-stone-100 border-2 shadow-lg">
            <form
                id="edit-form"
                className="flex flex-col justify-start h-full w-full"
                action={editProjectAction}
            >
                <input
                    name="pid"
                    value={project.id!}
                    readOnly
                    hidden
                />
                <input
                    name="author_id"
                    value={project.author_id!}
                    readOnly
                    hidden
                />
                <div className="flex flex-row w-full justify-between p-10">
                    <div className="flex flex-col w-2/3">
                        {!isEdit ? (
                            <h1 className="font-medium truncate text-3xl">
                                {name}
                            </h1>
                        ) : (
                            <input name="name" defaultValue={name} />
                        )}

                        {!isEdit ? (
                            <h2 id="status" className="text-xl mt-5">
                                {stage}
                            </h2>
                        ) : (
                            <select
                                defaultValue={stage}
                                id="stage"
                                name="stage"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 mb-2 w-full"
                            >
                                <option value={Stage.IDEA}>
                                    Idea
                                </option>
                                <option value={Stage.PLAN}>
                                    Planning
                                </option>
                                <option value={Stage.DEVELOPMENT}>
                                    In development
                                </option>
                                <option value={Stage.FINISHED}>
                                    Finished
                                </option>
                                <option value={Stage.PRODUCTION}>
                                    In production
                                </option>
                            </select>
                        )}
                    </div>
                    {session && (
                        <div className="flex flex-row gap-2 w-fit justify-center items-center">
                            {session.user?.id == author.id && (
                                <EditButton
                                    setIsEdit={setIsEdit}
                                    isEdit={isEdit}
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-row border-t-2 h-full w-full p-10">
                    {!isEdit ? (
                        <h2 className="font-normal text-wrap w-1/2 truncate text-xl">
                            {description}
                        </h2>
                    ) : (
                        <textarea
                            defaultValue={description ?? undefined}
                            className="h-32 max-h-40 min-h-20 bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                    rounded-lg block w-full p-2.5 "
                            placeholder="Type a project description"
                            name="description"
                        />
                    )}
                </div>
            </form>
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
                {session && (
                    <div className="flex flex-row gap-2 w-fit justify-center items-center">
                        <SupportButton
                            isFollowed={isFollowedState}
                            follow={follow}
                            unfollow={unfollow}
                            setIsFollowedState={setIsFollowedState}
                            pid={id}
                            uid={session.user!.id}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

const SupportButton = ({
    pid,
    uid,
    isFollowed,
    follow,
    unfollow,
    setIsFollowedState,
}: SupportButtonProps) => {
    return (
        <form action={isFollowed ? unfollow : follow}>
            <div className="flex justiyf-center items-center">
                <button
                    type="submit"
                    className="cursor-pointer inline-flex py-4 px-6 text-sm font-medium justify-center items-center bg-white border-2 border-blue-500 rounded-lg 
            group hover:bg-blue-100 text-blue-500 transition"
                    onClick={() => setIsFollowedState(!isFollowed)}
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
                    {!isFollowed
                        ? 'Support Project'
                        : 'Unsupport Project'}
                </button>
            </div>
            <input hidden id="pid" name="pid" value={pid} readOnly />
            <input hidden id="uid" name="uid" value={uid} readOnly />
        </form>
    )
}

const EditButton = ({
    setIsEdit,
    isEdit,
}: {
    isEdit: boolean
    setIsEdit: Dispatch<SetStateAction<boolean>>
}) => {
    // Opens a modal to edit the project -> redirects to the project page

    return (
        <div>
            {!isEdit ? (
                <div className="flex justiyf-center items-center">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            setIsEdit(true)
                        }}
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
            ) : (
                <div className="flex justify-center items-center">
                    <button
                        type="submit"
                        className="cursor-pointer inline-flex py-4 px-6 text-sm font-medium justify-center items-center bg-emerald-500 border-2 border-emerald-500 rounded-lg 
            hover:bg-emerald-600 text-white transition"
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
                        Submit
                    </button>
                </div>
            )}
        </div>
    )
}
