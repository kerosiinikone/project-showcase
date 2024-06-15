'use client'

import ModalLayout from '@/components/ModalLayout'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFormState } from 'react-dom'
import CreateDashboardModal from '../CreateDashboardModal'
import getSupportedList from '../../_actions/get-supported-projects-list'
import { Github } from 'lucide-react'
import { toast } from 'react-toastify'
import { Dialog } from '@radix-ui/react-dialog'
import { DialogTrigger } from '@/components/ui/dialog'

export interface SupportedProjectProps {
    name: string
    image?: string
    id: string
}

// Refactor !!!!!

export default function UserSupportCount({
    supports,
}: {
    supports: number
}) {
    const formRef = useRef<HTMLFormElement | null>(null)
    const [supportedProjectsRaw, dispatch] = useFormState(
        getSupportedList,
        { data: [] }
    )

    const fetch = () => {
        formRef.current?.requestSubmit()
    }

    const onBottom = (e: any) => {
        if (
            e.target.scrollHeight > 0 &&
            e.target.scrollHeight - e.target.scrollTop ===
                e.target.clientHeight &&
            supportedProjectsRaw.nextCursor
        )
            fetch()
    }

    const supportedProjectsData = useMemo(
        () =>
            !supportedProjectsRaw.error
                ? supportedProjectsRaw.data
                : [],
        [supportedProjectsRaw]
    )

    useEffect(() => {
        if (supportedProjectsRaw && supportedProjectsRaw.error) {
            toast('Error: ' + supportedProjectsRaw.error, {
                position: 'bottom-center',
                autoClose: 5000,
                type: 'error',
                hideProgressBar: true,
                closeOnClick: true,
                progress: undefined,
                theme: 'colored',
            })
        }
    }, [supportedProjectsRaw])

    return (
        <Dialog>
            <>
                <CreateDashboardModal title="Supported Projects">
                    <ul
                        onScroll={onBottom}
                        className="h-full w-full font-medium overflow-y-auto"
                    >
                        {supportedProjectsData.map((project) => {
                            return (
                                <li
                                    key={project.id}
                                    className="pb-4 rounded-lg my-2"
                                >
                                    <div className="flex flex-row justify-start items-center gap-2">
                                        {project.github_url && (
                                            <Github />
                                        )}
                                        <div className="flex flex-row justify-start items-center gap-2 truncate">
                                            <h1 className="flex gap-2 truncate text-xl font-medium text-gray-900 truncate w-full">
                                                {project.name.trim()}
                                                <span className="text-md text-gray-300 truncate text-clip">
                                                    {project.alt_id}
                                                </span>
                                            </h1>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </CreateDashboardModal>
            </>
            <form action={dispatch} ref={formRef}>
                <DialogTrigger type="submit">
                    <div className="col-span-1 flex flex-col px-10 py-2 w-fit items-center justify-center cursor-pointer rounded-lg hover:bg-slate-100 transition">
                        <h1 className="font-medium">
                            Supported Projects
                        </h1>
                        <h2>{supports}</h2>
                    </div>
                </DialogTrigger>
                <input
                    hidden
                    id="nextCursor"
                    readOnly
                    name="nextCursor"
                    value={
                        supportedProjectsRaw?.nextCursor ?? undefined
                    }
                />
            </form>
        </Dialog>
    )
}
