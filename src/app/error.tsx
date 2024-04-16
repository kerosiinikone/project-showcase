'use client'

// GLOBAL -> global error fallback for now

export default function Error({
    reset,
    error,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col gap-4 py-10 px-20 rounded-lg bg-white items-center justify-center shadow-xl">
                <h1 className="text-2xl font-medium">Error</h1>
                <h2 className="text-xl">{error.message}</h2>
                <button onClick={() => reset()}>Try again</button>
            </div>
        </div>
    )
}
