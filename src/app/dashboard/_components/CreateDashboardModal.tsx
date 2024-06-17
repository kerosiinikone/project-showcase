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
            className="flex flex-col justify-center items-center w-fit md:w-[600px] xl:py-4 xl:px-8 py-8 px-10 h-fit bg-white border-2 border-slate-200 
                rounded-lg shadow-xl"
        >
            <DialogHeader className="flex items-center justify-between md:p-6">
                <DialogTitle className="text-2xl font-semibold text-gray-900 ">
                    {title ?? 'Title'}
                </DialogTitle>
            </DialogHeader>
            <div
                id="modal-content"
                className="flex justify-center w-fit md:w-full items-center h-[300px] md:px-4 md:pb-4"
            >
                {children}
            </div>
        </DialogContent>
    )
}
