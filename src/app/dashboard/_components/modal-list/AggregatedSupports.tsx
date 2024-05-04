'use client'

import ModalLayout from '@/components/ModalLayout'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFormState } from 'react-dom'
import CreateDashboardModal from '../CreateDashboardModal'
import getAggreagtedSupportsList from '../../_actions/get-aggregated-supports-list'
import { toast } from 'react-toastify'
import { Dialog } from '@radix-ui/react-dialog'
import { DialogTrigger } from '@/components/ui/dialog'

export interface SupportedProjectProps {
    name: string
    image?: string
    id: string
}

export default function AggregatedSupports({
    supports,
}: {
    supports?: number
}) {
    const formRef = useRef<HTMLFormElement | null>(null)
    const [aggregatedSupportsRaw, dispatch] = useFormState(
        getAggreagtedSupportsList,
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
            aggregatedSupportsRaw.nextCursor
        )
            fetch()
    }

    const aggregatedSupports = useMemo(
        () =>
            !aggregatedSupportsRaw.error
                ? aggregatedSupportsRaw.data
                : [],
        [aggregatedSupportsRaw]
    )

    useEffect(() => {
        if (aggregatedSupportsRaw && aggregatedSupportsRaw.error) {
            toast('Error: ' + aggregatedSupportsRaw.error, {
                position: 'bottom-center',
                autoClose: 5000,
                type: 'error',
                hideProgressBar: true,
                closeOnClick: true,
                progress: undefined,
                theme: 'colored',
            })
        }
    }, [aggregatedSupportsRaw])

    return (
        <Dialog>
            <>
                <CreateDashboardModal title="Supports">
                    <ul
                        onScroll={onBottom}
                        className="h-full w-full font-medium overflow-y-auto "
                    >
                        {aggregatedSupports.map(
                            ({ project, count }) => {
                                return (
                                    <li
                                        key={project?.id}
                                        className="pb-4 rounded-lg my-2"
                                    >
                                        <div className="flex flex-row justify-start items-center space-x-4">
                                            <div className="flex flex-col justify-start items-center">
                                                <div className="flex flex-row justify-start items-center gap-2 w-full">
                                                    <h1 className="text-xl font-medium text-gray-900 truncate">
                                                        {
                                                            project?.name
                                                        }
                                                    </h1>
                                                    <h3 className="text-md text-gray-300 truncate">
                                                        {count}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            }
                        )}
                    </ul>
                </CreateDashboardModal>
            </>
            <form action={dispatch} ref={formRef}>
                <DialogTrigger type="submit">
                    <div className="col-span-1 flex flex-col px-10 py-2 w-fit items-center justify-center cursor-pointer rounded-lg hover:bg-slate-100 transition">
                        <h1 className="font-medium">Supports</h1>
                        <h2>{supports}</h2>
                    </div>
                </DialogTrigger>
                <input
                    hidden
                    id="nextCursor"
                    readOnly
                    name="nextCursor"
                    value={
                        aggregatedSupportsRaw?.nextCursor ?? undefined
                    }
                />
            </form>
        </Dialog>
    )
}

// Add later
// export const ProjectListItem = memo(
//     ({ id, name, image }: SupportedProjectProps) => {
//         return <div></div>
//     },
//     (prev: SupportedProjectProps, next: SupportedProjectProps) => {
//         return prev.id == next.id
//     }
// )
