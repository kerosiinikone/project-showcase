'use client'

import ModalLayout from '@/components/ModalLayout'
import { useMemo, useRef, useState } from 'react'
import { useFormState } from 'react-dom'
import CreateDashboardModal from '../CreateDashboardModal'
import getAggreagtedSupportsList from '../../_actions/get-aggregated-supports-list'

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
    const [show, setShow] = useState<boolean>(false)
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

    return (
        <>
            <ModalLayout show={show}>
                <CreateDashboardModal
                    title="Supports"
                    onBottom={onBottom}
                    content={aggregatedSupports}
                    setShow={setShow}
                />
            </ModalLayout>
            <form action={dispatch} ref={formRef}>
                <button
                    type="submit"
                    onClick={() => {
                        setShow(true)
                    }}
                >
                    <div className="col-span-1 flex flex-col px-10 py-2 w-fit items-center justify-center cursor-pointer rounded-lg hover:bg-slate-100 transition">
                        <h1 className="font-medium">Supports</h1>
                        <h2>{supports}</h2>
                    </div>
                </button>
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
        </>
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
