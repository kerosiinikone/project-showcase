'use client'

import { useEffect } from 'react'

// GLOBAL -> global error fallback for now

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex justify-center items-center">
            <h2 className="m-10 font-medium">
                Something went wrong!
            </h2>
            <button onClick={() => reset()}>Try again</button>
        </div>
    )
}
