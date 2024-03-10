'use client'

import React, { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { Stage } from '@/models/Project/types'
import { PlusIcon, X } from 'lucide-react'
import { UserRepo } from '@/services/octokit/types'
import createProjectAction from '@/app/_actions/create-project-action'
import { BaseModalContentParams } from './ModalLayout'
import TagLabel from './TagItem'

type ModalContentParams = BaseModalContentParams & {
    repos: UserRepo[] | null
}

// Structure !!!
// Improve !!!

export default function CreateProjectModal({
    setShow,
    repos,
}: ModalContentParams) {
    const [state, dispatch] = useFormState(createProjectAction, null)
    const [tags, setTags] = useState<string[]>([])
    const handleClose = () => {
        setShow(false)
    }

    useEffect(() => {
        if (state?.error) {
            // Handle
        }
    }, [state])

    return (
        <div className="fixed h-screen w-screen z-50 flex justify-center items-center left-40">
            <div
                className="flex justify-center items-center w-[1200px] h-max bg-white border-2 border-slate-200 
                rounded-lg shadow-xl"
            >
                <div className="bg-white rounded-lg shadow w-full h-full">
                    <div className="flex items-center justify-between p-6">
                        <h1 className="text-2xl font-semibold text-gray-900 ">
                            Create New Project
                        </h1>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg 
                            text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                        >
                            <X
                                className="w-5 h-5"
                                aria-hidden="true"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                fill="none"
                            />
                            <span className="sr-only">
                                Close modal
                            </span>
                        </button>
                    </div>
                    <form
                        action={dispatch}
                        onSubmit={() => handleClose()}
                        id="create-project"
                        className="flex flex-col justify-between p-6 h-max"
                    >
                        <input
                            hidden
                            readOnly
                            name="tags"
                            value={`[${tags.map((t) => {
                                return `"${t}"`
                            })}]`}
                        />
                        <div className="grid gap-4 mb-4 grid-cols-2">
                            <div className="col-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Name
                                </label>
                                <input
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                    rounded-lg py-2 px-3 w-full"
                                    placeholder="Type a project name"
                                    name="name"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 mb-4 grid-cols-2">
                            <div className="col-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 ">
                                    Description
                                </label>
                                <textarea
                                    className="h-32 max-h-40 min-h-20 bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                    rounded-lg block w-full p-2.5 "
                                    placeholder="Type a project description"
                                    name="description"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 mb-4 grid-cols-2 grid-rows-1">
                            <div className="row-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Stage
                                </label>
                                <select
                                    id="stage"
                                    name="stage"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 mb-2 w-full"
                                >
                                    <option
                                        key={Stage.IDEA}
                                        value={Stage.IDEA}
                                    >
                                        Idea
                                    </option>
                                    <option
                                        key={Stage.PLAN}
                                        value={Stage.PLAN}
                                    >
                                        Planning
                                    </option>
                                    <option
                                        key={Stage.DEVELOPMENT}
                                        value={Stage.DEVELOPMENT}
                                    >
                                        In development
                                    </option>
                                    <option
                                        key={Stage.FINISHED}
                                        value={Stage.FINISHED}
                                    >
                                        Finished
                                    </option>
                                    <option
                                        key={Stage.PRODUCTION}
                                        value={Stage.PRODUCTION}
                                    >
                                        In production
                                    </option>
                                </select>
                            </div>
                            <div className="row-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Github Repo
                                </label>
                                <select
                                    id="github_url"
                                    name="github_url"
                                    defaultValue=""
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 mb-2 w-full"
                                >
                                    <option selected value="">
                                        None
                                    </option>
                                    {repos?.map((repo) => {
                                        return (
                                            <option
                                                value={
                                                    repo.github_url
                                                }
                                            >
                                                {repo.name}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="grid gap-4 mb-4 grid-cols-2">
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
                                                setTags((state) => {
                                                    return [
                                                        ...state,
                                                        e.target
                                                            .value,
                                                    ]
                                                })
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
                            <div className="flex flex-row gap-2">
                                {tags.map((t) => {
                                    return (
                                        <TagLabel
                                            key={t}
                                            name={t}
                                            remove={() => {
                                                setTags((state) => {
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
                                        />
                                    )
                                })}
                            </div>
                        </div>
                        <div className="flex w-full h-full items-end">
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2">
                                    <button
                                        type="submit"
                                        className="w-64 cursor-pointer inline-flex py-5 px-7 text-sm font-medium 
                                        justify-center items-center bg-blue-700 rounded-lg 
                                        group hover:bg-blue-800 text-white transition"
                                    >
                                        <PlusIcon
                                            className="w-5 h-5 me-2"
                                            stroke="white"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            aria-hidden="true"
                                            fill="none"
                                            viewBox="0 0 22 24"
                                        />
                                        Create a Project
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
