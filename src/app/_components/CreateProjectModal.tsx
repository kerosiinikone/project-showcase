'use client'

import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type CreateProjectModalInterface = {
    show: boolean
    setShow: Dispatch<SetStateAction<boolean>>
}

const ModalContent = ({ close }: { close: () => void }) => {
    return (
        <div className="fixed h-screen w-screen z-50 flex justify-center items-center left-40">
            <div className="flex justify-center items-center w-[1200px] h-[800px] bg-white border-2 border-slate-200 rounded-lg shadow-xl">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 w-full h-full">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Create New Project
                        </h1>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => close()}
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form className="p-4 md:p-5">
                        <div className="grid gap-4 mb-4 grid-cols-2">
                            <div className="col-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Type a project name"
                                    required
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function CreateProjectModal({
    show,
    setShow,
}: CreateProjectModalInterface) {
    const ref = useRef<Element | null>(null)
    const handleClose = () => {
        setShow(false)
    }

    useEffect(() => {
        ref.current = document.getElementById('modal')
    }, [])

    return show && ref.current
        ? createPortal(<ModalContent close={handleClose} />, ref.current)
        : null
}
