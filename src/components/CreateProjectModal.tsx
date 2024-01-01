'use client'

import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import useCreateProject from '../app/_hooks/useCreateProject'
import { Stage } from '@/models/Project/types'
import { SubmitHandler, useForm } from 'react-hook-form'
import { PlusIcon, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

type ModalLayoutParams = {
    show: boolean
    setShow: Dispatch<SetStateAction<boolean>>
}

type ModalContentParams = {
    setShow: Dispatch<SetStateAction<boolean>>
}

type IFormInput = {
    name: string
    description: string | null
    github_url: string | null
    stage: Stage
}

// Structure !!!
// Improve !!!

/*
    Change to SSA w/ tRPC Component Layer
*/

const CreateProjectModal = ({ setShow }: ModalContentParams) => {
    const handleClose = () => setShow(false)
    const router = useRouter()
    const { register, handleSubmit, reset } = useForm<IFormInput>()
    const [createProject] = useCreateProject({}, router, handleClose)

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        createProject({
            name: data.name,
            description: data.description != '' ? data.description : null,
            stage: data.stage,
            github_url: data.github_url,
        })
        reset()
    }

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
                                    {...register('name')}
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
                                    {...register('description')}
                                    className="h-32 max-h-40 min-h-20 bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                    rounded-lg block w-full p-2.5 "
                                    placeholder="Type a project description"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 mb-4 grid-cols-2 grid-rows-1">
                            <div className="row-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Stage
                                </label>
                                <select
                                    {...register('stage')}
                                    id="stage"
                                    name="stage"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 dark:bg-gray-600 mb-2 w-full"
                                >
                                    <option value={Stage.IDEA}>Idea</option>
                                    <option value={Stage.PLAN}>Planning</option>
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
                                    Github URL
                                </label>
                                <input
                                    {...register('github_url')}
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

export default function ModalLayout({ show, setShow }: ModalLayoutParams) {
    const ref = useRef<Element | null>(null)
    useEffect(() => {
        // "document" undefined before rendering
        ref.current = document.getElementById('modal')
    }, [])
    return show && ref.current
        ? createPortal(<CreateProjectModal setShow={setShow} />, ref.current)
        : null
}
