'use client'

import { Button } from '@/components/ui/button'
import { Stage } from '@/models/Project/types'
import { X } from 'lucide-react'
import { useState } from 'react'

interface FilterProps {
    stage: Stage[]
    initSearch: () => void
    resetCursor: () => void
}

export default function Filters({
    initSearch,
    stage,
    resetCursor,
}: FilterProps) {
    const [stageFilter, setStateFilter] = useState<Stage[]>(
        stage ?? []
    )
    const [hasGithubFilter, setHasGithubFilter] = useState<
        null | boolean
    >(null)

    const handleSetGithubTrue = () => {
        if (hasGithubFilter !== null && hasGithubFilter) {
            setHasGithubFilter(null)
        } else {
            setHasGithubFilter(true)
        }
    }

    const handleSetGithubFalse = () => {
        if (hasGithubFilter !== null && !hasGithubFilter) {
            setHasGithubFilter(null)
        } else {
            setHasGithubFilter(false)
        }
    }

    const handleStageFilter = (s: Stage) => {
        if (stageFilter?.includes(s)) {
            setStateFilter((state) => {
                return state?.filter((stage) => stage !== s)
            })
        } else {
            setStateFilter((state) => {
                return [...(state || []), s]
            })
        }

        resetCursor()
    }

    return (
        <div className="flex flex-row w-full justify-start my-4 gap-6">
            <div className="flex flex-row gap-2" id="stage-filter">
                <Button
                    onClick={() => handleStageFilter(Stage.IDEA)}
                    variant="secondary"
                >
                    {stageFilter?.includes(Stage.IDEA) ? (
                        <span className="flex flex-row justify-center items-center gap-2">
                            <X size={15} />
                            Idea
                        </span>
                    ) : (
                        'Idea'
                    )}
                </Button>
                <Button
                    onClick={() => handleStageFilter(Stage.PLAN)}
                    variant="secondary"
                >
                    {stageFilter?.includes(Stage.PLAN) ? (
                        <span className="flex flex-row justify-center items-center gap-2">
                            <X size={15} />
                            Plan
                        </span>
                    ) : (
                        'Plan'
                    )}
                </Button>
                <Button
                    onClick={() =>
                        handleStageFilter(Stage.DEVELOPMENT)
                    }
                    variant="secondary"
                >
                    {stageFilter?.includes(Stage.DEVELOPMENT) ? (
                        <span className="flex flex-row justify-center items-center gap-2">
                            <X size={15} />
                            Development
                        </span>
                    ) : (
                        'Development'
                    )}
                </Button>
                <Button
                    onClick={() => handleStageFilter(Stage.FINISHED)}
                    variant="secondary"
                >
                    {stageFilter?.includes(Stage.FINISHED) ? (
                        <span className="flex flex-row justify-center items-center gap-2">
                            <X size={15} />
                            Finished
                        </span>
                    ) : (
                        'Finished'
                    )}
                </Button>
                <Button
                    onClick={() =>
                        handleStageFilter(Stage.PRODUCTION)
                    }
                    variant="secondary"
                >
                    {stageFilter?.includes(Stage.PRODUCTION) ? (
                        <span className="flex flex-row justify-center items-center gap-2">
                            <X size={15} />
                            Production
                        </span>
                    ) : (
                        'Production'
                    )}
                </Button>
            </div>
            <div className="flex flex-row gap-2" id="github-filter">
                {hasGithubFilter !== null && hasGithubFilter ? (
                    <Button
                        variant="outline"
                        onClick={handleChangeWithSearch(
                            handleSetGithubTrue,
                            initSearch
                        )}
                    >
                        Github
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        onClick={handleChangeWithSearch(
                            handleSetGithubTrue,
                            initSearch
                        )}
                    >
                        Github
                    </Button>
                )}
                {hasGithubFilter !== null && !hasGithubFilter ? (
                    <Button
                        onClick={handleChangeWithSearch(
                            handleSetGithubFalse,
                            initSearch
                        )}
                        variant="outline"
                    >
                        No Github
                    </Button>
                ) : (
                    <Button
                        onClick={handleChangeWithSearch(
                            handleSetGithubFalse,
                            initSearch
                        )}
                        variant="ghost"
                    >
                        No Github
                    </Button>
                )}
            </div>
            <input
                name="stageFilter"
                value={JSON.stringify(stageFilter)}
                readOnly
                hidden
            />
            <input
                hidden
                readOnly
                name="hasGithub"
                value={
                    hasGithubFilter == null
                        ? ''
                        : JSON.stringify(hasGithubFilter)
                }
            />
        </div>
    )
}

const handleChangeWithSearch = (
    f: () => void,
    callback: () => void
) => {
    return () => {
        f()
        setTimeout(() => {
            callback()
        }, 500)
    }
}
