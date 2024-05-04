'use client'

import { ProjectWithUser, Stage } from '@/models/Project/types'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'react-toastify'
import editProjectAction from '../_actions/edit-project-action'
import SubmitButton from './ui/SubmitButton'

interface ProjecEditProps {
    session: any
    project: ProjectWithUser & { id: number }
}

export default function EditProjectWrapper({
    session,
    project: {
        author,
        tags,
        id,
        author_id,
        name,
        github_url,
        stage,
        description,
    },
}: ProjecEditProps) {
    const [tagInput, setTagInput] = useState<string[]>(tags ?? [])
    const [state, editAction] = useFormState(editProjectAction, {
        done: false,
        pid: id,
        author_id,
    })

    useEffect(() => {
        if (state && state.error) {
            toast('Error: ' + state.error, {
                position: 'bottom-center',
                autoClose: 5000,
                type: 'error',
                hideProgressBar: true,
                closeOnClick: true,
                progress: undefined,
                theme: 'colored',
            })
        }
    }, [state])

    return (
        <form
            action={editAction}
            className="flex flex-col justify-start h-full w-full rounded-xl bg-white border-stone-100 border-2 shadow-lg"
        >
            <div className="flex flex-col justify-start h-full w-full">
                <div className="flex flex-row w-full justify-between p-10">
                    <div className="flex flex-col w-2/3">
                        <input
                            name="name"
                            placeholder="Name"
                            defaultValue={name}
                        />

                        <select
                            defaultValue={stage}
                            id="stage"
                            name="stage"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 mb-2 w-full"
                        >
                            <option value={Stage.IDEA}>Idea</option>
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
                    </div>
                    <div className="flex flex-row gap-2">
                        {session && (
                            <div className="flex flex-row gap-2 w-fit justify-center items-center">
                                <div className="flex flex-row gap-2 w-fit justify-center items-center">
                                    {session.user?.id ==
                                        author.id && <SubmitButton />}
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
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-row border-t-2 gap-4 h-full w-full p-10">
                    <textarea
                        defaultValue={description ?? ''}
                        className="h-32 max-h-40 min-h-20 w-1/2 bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                    rounded-lg block p-2.5 "
                        placeholder="Type a project description"
                        name="description"
                    />
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

                        <>
                            <div className="col-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Tags
                                </label>
                                <input
                                    onKeyDown={(
                                        e: React.KeyboardEvent<HTMLInputElement> & {
                                            target: {
                                                value: string
                                            }
                                        }
                                    ) => {
                                        if (e.code === 'Enter') {
                                            e.preventDefault()
                                            if (
                                                tags.indexOf(
                                                    e.target.value
                                                ) === -1 &&
                                                tags.length < 3 // Global limit somewhere ??
                                            ) {
                                                setTagInput(
                                                    (state) => {
                                                        return [
                                                            ...state,
                                                            e.target
                                                                .value,
                                                        ]
                                                    }
                                                )
                                                setTimeout(() => {
                                                    e.target.value =
                                                        ''
                                                }, 100)
                                            }
                                        }
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                    rounded-lg py-2 px-3 w-full"
                                    placeholder="Give your project tags"
                                />
                            </div>
                            {tagInput.map((t) => {
                                return (
                                    <div
                                        key={t}
                                        className="flex items-center h-fit justify-center gap-2 flex-row w-max py-2 px-3 bg-blue-600 rounded-xl group cursor-pointer"
                                        onClick={() => {
                                            setTagInput((state) => {
                                                return state.filter(
                                                    (tag) => {
                                                        return (
                                                            tag !== t
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
                        </>
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
                    <div
                        id="github-icon"
                        className="flex flex-col w-fit h-fit p-2 justify-center items-center cursor-pointer border-2 border-black rounded-md hover:bg-gray-300 transition"
                    >
                        <input
                            name="github"
                            placeholder="Github URL"
                            defaultValue={github_url ?? ''}
                        />
                    </div>
                </div>
            </div>
        </form>
    )
}
