'use client'

import { ProjectWithUser, Stage } from '@/models/Project/types'
import { Delete, Github, Pencil, UserPlus, X } from 'lucide-react'
import { Session } from 'next-auth/types'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import deleteProjectAction from '../_actions/delete-project-action'
import editProjectAction from '../_actions/edit-project-action'
import supportProjectAction from '../_actions/follow-project-action'
import unsupportProjectAction from '../_actions/unfollow-project-action'
import { Markdown } from './Markdown'

interface ProjectWrapperProps {
    session: Session | null
    isFollowed: boolean
    project: ProjectWithUser & { id: number }
    readme?: string | null
}

interface SupportButtonProps {
    uid: string
    pid: number
    unsupportWithParams: (payload: FormData) => void
    supportWithParams: (payload: FormData) => void
    setIsFollowedState: Dispatch<SetStateAction<boolean>>
    isFollowed: boolean
}

// Loading state while edit is submitting -> useFormStatus

export default function ProjectWrapper({
    session,
    project: {
        name,
        stage,
        author,
        tags,
        id,
        description,
        github_url,
        author_id,
    },
    readme,
    isFollowed,
}: ProjectWrapperProps) {
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [isDelete, setIsDelete] = useState<boolean>(false)
    const [isFollowedState, setIsFollowedState] =
        useState<boolean>(isFollowed)
    const router = useRouter()

    const [descriptionInput, setDescriptionInput] = useState<string>(
        description ?? ''
    )
    const [nameInput, setNameInput] = useState<string>(name ?? '')
    const [tagInput, setTagInput] = useState<string[]>(tags ?? [])
    const [stageInput, setStageInput] = useState<string>(stage ?? '')
    const [ghInput, SetGhInput] = useState<string>(github_url ?? '')

    const [editState, editAction] = useFormState(editProjectAction, {
        done: false,
        pid: id,
        author_id,
    })

    const [deleteState, deleteAction] = useFormState(
        deleteProjectAction,
        {
            done: false,
            pid: id,
            author_id,
        }
    )

    const unsupportWithParams = unsupportProjectAction.bind(null, id)
    const supportWithParams = supportProjectAction.bind(null, id)

    useEffect(() => {
        if (editState.done && !editState?.error) {
            setIsEdit(false)
            router.refresh()
        }
    }, [editState])

    useEffect(() => {
        if (deleteState.done && !deleteState?.error) {
            setIsDelete(false)
            router.push('/dashboard')
        }
    }, [deleteState])

    return (
        <div className="flex flex-col justify-start h-full w-full rounded-xl bg-white border-stone-100 border-2 shadow-lg">
            <div className="flex flex-col justify-start h-full w-full">
                <div className="flex flex-row w-full justify-between p-10">
                    <div className="flex flex-col w-2/3">
                        {!isEdit ? (
                            <h1 className="font-medium truncate text-3xl">
                                {name}
                            </h1>
                        ) : (
                            <input
                                name="name"
                                placeholder="Name"
                                onChange={(e) => {
                                    setNameInput(e.target.value)
                                }}
                                value={nameInput}
                            />
                        )}

                        {!isEdit ? (
                            <h2 id="status" className="text-xl mt-5">
                                {stage}
                            </h2>
                        ) : (
                            <select
                                onChange={(e) => {
                                    setStageInput(e.target.value)
                                }}
                                value={stageInput}
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
                                <form
                                    action={
                                        isEdit
                                            ? editAction
                                            : undefined
                                    }
                                    className="flex flex-row gap-2 w-fit justify-center items-center"
                                >
                                    {session.user?.id ==
                                        author.id && (
                                        <EditButton
                                            setIsEdit={setIsEdit}
                                            isEdit={isEdit}
                                        />
                                    )}
                                    <input
                                        name="stage"
                                        value={stageInput}
                                        hidden
                                        readOnly
                                    />
                                    <input
                                        hidden
                                        readOnly
                                        name="tags"
                                        value={`[${tagInput.map(
                                            (t) => {
                                                return `"${t}"`
                                            }
                                        )}]`}
                                    />
                                    <input
                                        name="github_url"
                                        value={ghInput}
                                        hidden
                                        readOnly
                                    />
                                    <input
                                        name="name"
                                        value={nameInput}
                                        hidden
                                        readOnly
                                    />
                                    <input
                                        name="description"
                                        value={descriptionInput}
                                        hidden
                                        readOnly
                                    />
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-row border-t-2 gap-4 h-full w-full p-10">
                    {!isEdit ? (
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
                    ) : (
                        <textarea
                            onChange={(e) => {
                                setDescriptionInput(e.target.value)
                            }}
                            value={descriptionInput}
                            className="h-32 max-h-40 min-h-20 w-1/2 bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                    rounded-lg block p-2.5 "
                            placeholder="Type a project description"
                            name="description"
                        />
                    )}
                    {!isEdit && readme && (
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
                        {!isEdit
                            ? tags.map((t) => {
                                  return (
                                      <div className="mt-2" key={t}>
                                          <div className="flex items-center justify-center gap-2 flex-row w-max py-2 px-3 bg-blue-600 rounded-xl cursor-pointer">
                                              <h2 className="text-white font-medium text-sm">
                                                  {t}
                                              </h2>
                                          </div>
                                      </div>
                                  )
                              })
                            : tagInput.map((t) => {
                                  return (
                                      <div
                                          className="flex items-center h-fit justify-center gap-2 flex-row w-max py-2 px-3 bg-blue-600 rounded-xl group cursor-pointer"
                                          onClick={() => {
                                              setTagInput((state) => {
                                                  return state.filter(
                                                      (tag) => {
                                                          return (
                                                              tag !==
                                                              t
                                                          )
                                                      }
                                                  )
                                              })
                                          }}
                                      >
                                          <span className="group-hover:inline hidden">
                                              <X
                                                  size={15}
                                                  color="white"
                                              />
                                          </span>
                                          <h2 className="text-white font-medium text-sm">
                                              {t}
                                          </h2>
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
                    {(isEdit || github_url) && (
                        <div
                            id="github-icon"
                            className="flex flex-col w-fit h-fit p-2 justify-center items-center cursor-pointer border-2 border-black rounded-md hover:bg-gray-300 transition"
                        >
                            {!isEdit && github_url && (
                                <a href={github_url} target="_blank">
                                    <Github size="30" />
                                </a>
                            )}
                            {isEdit && (
                                <input
                                    name="github"
                                    placeholder="Github URL"
                                    onChange={(e) => {
                                        SetGhInput(e.target.value)
                                    }}
                                    value={ghInput}
                                />
                            )}
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

const SupportButton = ({
    isFollowed,
    setIsFollowedState,
    unsupportWithParams,
    supportWithParams,
}: SupportButtonProps) => {
    return (
        <form
            onSubmit={() => {
                setIsFollowedState(!isFollowed)
            }}
            action={
                isFollowed ? unsupportWithParams : supportWithParams
            }
        >
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
                    {!isFollowed
                        ? 'Support Project'
                        : 'Unsupport Project'}
                </button>
            </div>
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
                <div className="flex justify-center items-center">
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

const DeleteButton = ({
    setIsDelete,
    isDelete,
}: {
    isDelete: boolean
    setIsDelete: Dispatch<SetStateAction<boolean>>
}) => {
    // Opens a modal to edit the project -> redirects to the project page

    return (
        <div>
            {!isDelete ? (
                <div className="flex justify-center items-center">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            setIsDelete(true)
                        }}
                        className="cursor-pointer inline-flex py-4 px-6 text-sm font-medium justify-center items-center bg-white border-2 border-red-500 rounded-lg 
            group hover:bg-red-100 text-red-500 transition"
                    >
                        <Delete
                            className="w-5 h-5 me-2"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            aria-hidden="true"
                            fill="none"
                            viewBox="0 0 22 24"
                        />
                        Delete
                    </button>
                </div>
            ) : (
                <div className="flex justify-center items-center">
                    <button
                        type="submit"
                        className="cursor-pointer inline-flex py-4 px-6 text-sm font-medium justify-center items-center bg-red-500 border-2 border-red-500 rounded-lg 
            hover:bg-red-600 text-white transition"
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
                        Confirm
                    </button>
                </div>
            )}
        </div>
    )
}
