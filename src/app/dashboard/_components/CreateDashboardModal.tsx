'use client'

import {
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

type ModalContentParams = {
    title?: string
    children: React.ReactElement
}

// Loader before projects appear

export default function CreateDashboardModal({
    title,
    children,
}: ModalContentParams) {
    return (
        <DialogContent
            className="flex flex-col justify-center items-center w-[600px] h-fit bg-white border-2 border-slate-200 
                rounded-lg shadow-xl"
        >
            <DialogHeader className="flex items-center justify-between p-6">
                <DialogTitle className="text-2xl font-semibold text-gray-900 ">
                    {title ?? 'Title'}
                </DialogTitle>
            </DialogHeader>
            <div
                id="modal-content"
                className="flex justify-center w-full items-center h-[300px] px-6 pb-6"
            >
                {children}
            </div>
        </DialogContent>
    )
}
