'use client'

import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
} from 'react'
import { createPortal, useFormState } from 'react-dom'
import { Stage } from '@/models/Project/types'
import { PlusIcon, X } from 'lucide-react'
import { UserRepo } from '@/services/octokit/types'
import createProjectAction from '@/app/_actions/create-project-action'

type ModalLayoutParams = {
    show: boolean
    repos: UserRepo[] | null
    setShow: Dispatch<SetStateAction<boolean>>
}

type ModalContentParams = {
    repos: UserRepo[] | null
    setShow: Dispatch<SetStateAction<boolean>>
}

// Structure !!!
// Improve !!!

const CreateProjectModal = ({
    setShow,
    repos,
}: ModalContentParams) => {
    const [state, dispatch] = useFormState(createProjectAction, null)
    const handleClose = () => setShow(false)

    useEffect(() => {
        if (state?.error) {
            // Handle
        }
    }, [state])

    return (
        <div className="fixed h-screen w-screen z-50 flex justify-center items-center left-40">
            <div
                className="flex justify-center items-center w-[1200px] h-fit bg-white border-2 border-slate-200 
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
                        className="flex flex-col justify-between p-6 h-[500px]"
                    >
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

// Handles interaction and rendering
// Make reusable

export default function ModalLayout({
    show,
    setShow,
    repos,
}: ModalLayoutParams) {
    const ref = useRef<Element | null>(null)
    useEffect(() => {
        // "document" undefined before rendering
        ref.current = document.getElementById('modal')
    }, [])
    return show && ref.current
        ? createPortal(
              <CreateProjectModal setShow={setShow} repos={repos} />,
              ref.current
          )
        : null
}
