'use client'

import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export type BaseModalContentParams = {
    setShow: Dispatch<SetStateAction<boolean>>
}

type ModalLayoutParams = {
    show: boolean
}

export default function ModalLayout({
    show,
    children,
}: ModalLayoutParams & { children: React.ReactNode }) {
    const ref = useRef<Element | null>(null)

    useEffect(() => {
        // "document" undefined before rendering
        ref.current = document.getElementById('modal')
    }, [])

    return show && ref.current
        ? createPortal(children, ref.current)
        : null
}