'use client'

import { BaseModalContentParams } from '@/components/ModalLayout'
import { ProjectTypeWithId } from '@/models/Project/types'
import { Github, X } from 'lucide-react'
import { SyntheticEvent } from 'react'

type ModalContentParams = BaseModalContentParams & {
    title?: string
    content: ProjectTypeWithId[]
    onBottom: (e: SyntheticEvent) => void
}

// Loader before projects appear

export default function CreateDashboardModal({
    setShow,
    title,
    content,
    onBottom,
}: ModalContentParams) {
    const handleClose = () => {
        setShow(false)
    }
    return (
        <div className="fixed h-screen w-screen z-50 flex justify-center items-center left-40">
            <div
                className="flex justify-center items-center w-[600px] h-fit bg-white border-2 border-slate-200 
                rounded-lg shadow-xl"
            >
                <div className="bg-white rounded-lg shadow w-full h-full">
                    <div className="flex items-center justify-between p-6">
                        <h1 className="text-2xl font-semibold text-gray-900 ">
                            {title ?? 'Title'}
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
                    <div
                        id="modal-content"
                        className="flex justify-center w-full items-center h-[300px] px-6 pb-6"
                    >
                        <ul
                            onScroll={onBottom}
                            className="h-full w-full font-medium overflow-y-auto "
                        >
                            {content.map((project) => {
                                return (
                                    <li
                                        key={project.id}
                                        className="pb-4 rounded-lg my-2"
                                    >
                                        <div className="flex flex-row justify-start items-center space-x-4">
                                            {project.github_url && (
                                                <Github />
                                            )}
                                            <div className="flex flex-col justify-start items-center">
                                                <div className="flex flex-row justify-start items-center gap-2 w-full">
                                                    <h1 className="text-xl font-medium text-gray-900 truncate">
                                                        {project.name}
                                                    </h1>
                                                    <h3 className="text-md text-gray-300 truncate">
                                                        {
                                                            project.alt_id
                                                        }
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
