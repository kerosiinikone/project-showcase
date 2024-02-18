'use client'

import { BaseModalContentParams } from '@/components/ModalLayout'
import { Github, X } from 'lucide-react'
import { SyntheticEvent } from 'react'

type ModalContentParams = BaseModalContentParams & {
    title?: string
    children: React.ReactElement
}

// Loader before projects appear

export default function CreateDashboardModal({
    setShow,
    title,
    children,
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
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
