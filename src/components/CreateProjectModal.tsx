'use client'

import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ProjectParams } from '../app/_hooks/useCreateProject'
import { Stage } from '@/models/Project/types'
import { SubmitHandler, useForm } from 'react-hook-form'
import { PlusIcon, X } from 'lucide-react'

type CreateProjectModalParams = {
    show: boolean
    setShow: Dispatch<SetStateAction<boolean>>
    createProject: (p: ProjectParams) => void
}

type ModalContentParams = {
    setShow: Dispatch<SetStateAction<boolean>>
    createProject: (p: ProjectParams) => void
}

type IFormInput = {
    name: string
    description?: string
    github_url?: string
    stage: Stage
}

// Structure !!!
// Improve !!!

/*
    SSA vs. tRPC
    Form Hooks -> Integrating with services Page 
*/

const ModalContent = ({ setShow, createProject }: ModalContentParams) => {
    const { register, handleSubmit } = useForm<IFormInput>()

    const handleClose = () => setShow(false)

    const onSubmit: SubmitHandler<IFormInput> = (data) =>
        createProject({
            name: data.name,
            description: data.description,
            stage: data.stage,
            github_url: data.github_url,
        })

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
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg 
                            text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                            onClick={handleClose}
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
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form
                        id="create-project"
                        className="flex flex-col justify-between p-6 h-[500px]"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="grid gap-4 mb-4 grid-cols-2">
                            <div className="col-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Name
                                </label>
                                <input
                                    {...(register('name'),
                                    { required: true, maxLength: 191, min: 5 })}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                    rounded-lg py-2 px-3 w-full"
                                    placeholder="Type a project name"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 mb-4 grid-cols-2">
                            <div className="col-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 ">
                                    Description
                                </label>
                                <textarea
                                    {...(register('description'),
                                    { required: false })}
                                    className="h-32 max-h-40 min-h-20 bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                    rounded-lg block w-full p-2.5 "
                                    placeholder="Type a project description"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 mb-4 grid-cols-2 grid-rows-1">
                            <div className="row-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 ">
                                    Stage
                                </label>
                                <select
                                    {...(register('stage'), { required: true })}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                    rounded-lg block p-2.5 dark:bg-gray-600 mb-2 w-full"
                                >
                                    <option value="IDEA">Idea</option>
                                    <option value="PLAN">Planning</option>
                                    <option value="DEVELOPMENT">
                                        In development
                                    </option>
                                    <option value="FINISHED">Finished</option>
                                    <option value="PRODUCTION">
                                        In production
                                    </option>
                                </select>
                            </div>
                            <div className="row-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Github URL
                                </label>
                                <input
                                    {...(register('github_url'),
                                    { required: false, maxLength: 255 })}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                    rounded-lg block p-2.5 dark:bg-gray-600 w-full"
                                    placeholder="Github URL (optional)"
                                />
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

export default function CreateProjectModal({
    show,
    setShow,
    createProject,
}: CreateProjectModalParams) {
    const ref = useRef<Element | null>(null)
    useEffect(() => {
        ref.current = document.getElementById('modal')
    }, [])
    return show && ref.current
        ? createPortal(
              <ModalContent setShow={setShow} createProject={createProject} />,
              ref.current
          )
        : null
}
