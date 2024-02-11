'use client'

import ModalLayout from '@/components/ModalLayout'
import { memo, useMemo, useRef, useState } from 'react'
import { useFormState } from 'react-dom'
import CreateDashboardModal from '../CreateDashboardModal'
import getSupportedList from '../../_actions/get-supported-projects-list'

export interface SupportedProjectProps {
    name: string
    image?: string
    id: string
}

// Refactor !!!!!

export default function UserSupportCount({
    supports,
}: {
    supports?: number
}) {
    const formRef = useRef<HTMLFormElement | null>(null)
    const [show, setShow] = useState<boolean>(false)
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

    return (
        <>
            <ModalLayout show={show}>
                <CreateDashboardModal
                    title="Supported Projects"
                    onBottom={onBottom}
                    content={supportedProjectsData}
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
                        <h1 className="font-medium">
                            Supported Projects
                        </h1>
                        <h2>{supports}</h2>
                    </div>
                </button>
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
        </>
    )
}

// Add later
export const SupportedProjectListItem = memo(
    ({ id, name, image }: SupportedProjectProps) => {
        return <div></div>
    },
    (prev: SupportedProjectProps, next: SupportedProjectProps) => {
        return prev.id == next.id
    }
)
