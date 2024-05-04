'use client'

import { Stage } from '@/models/Project/types'
import { X } from 'lucide-react'
import { useState } from 'react'

interface FilterProps {
    stage: Stage[]
    initSearch: () => void
}

export default function Filters({ initSearch, stage }: FilterProps) {
    const [stageFilter, setStateFilter] = useState<Stage[]>(
        stage ?? []
    )
    const [hasGithubFilter, setHasGithubFilter] = useState<
        null | boolean
    >(null)

    const handleChangeWithSearch = (f: () => void) => {
        return () => {
            f()
            setTimeout(() => {
                initSearch()
            }, 500)
        }
    }

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

        // A simple solution to changing state
        // and skipping some ticks

        setTimeout(() => {
            initSearch()
        }, 500)
    }

    return (
        <div className="flex flex-row w-full justify-start my-4 gap-6">
            <div className="flex flex-row gap-2" id="stage-filter">
                <div
                    onClick={() => handleStageFilter(Stage.IDEA)}
                    className="flex flex-row justify-between items-center w-fit h-fit bg-slate-100 rounded-md py-2 px-4 border-slate-200 border-2
                                hover:bg-slate-200 transition cursor-pointer"
                >
                    {stageFilter?.includes(Stage.IDEA) ? (
                        <span className="flex flex-row justify-center items-center gap-2">
                            <X size={15} />
                            Idea
                        </span>
                    ) : (
                        'Idea'
                    )}
                </div>
                <div
                    onClick={() => handleStageFilter(Stage.PLAN)}
                    className="flex flex-row justify-between items-center w-fit h-fit bg-slate-100 rounded-md py-2 px-4 border-slate-200 border-2
                                hover:bg-slate-200 transition cursor-pointer"
                >
                    {stageFilter?.includes(Stage.PLAN) ? (
                        <span className="flex flex-row justify-center items-center gap-2">
                            <X size={15} />
                            Plan
                        </span>
                    ) : (
                        'Plan'
                    )}
                </div>
                <div
                    onClick={() =>
                        handleStageFilter(Stage.DEVELOPMENT)
                    }
                    className="flex flex-row justify-between items-center w-fit h-fit bg-slate-100 rounded-md py-2 px-4 border-slate-200 border-2
                                hover:bg-slate-200 transition cursor-pointer"
                >
                    {stageFilter?.includes(Stage.DEVELOPMENT) ? (
                        <span className="flex flex-row justify-center items-center gap-2">
                            <X size={15} />
                            Development
                        </span>
                    ) : (
                        'Development'
                    )}
                </div>
                <div
                    onClick={() => handleStageFilter(Stage.FINISHED)}
                    className="flex flex-row justify-between items-center w-fit h-fit bg-slate-100 rounded-md py-2 px-4 border-slate-200 border-2
                                hover:bg-slate-200 transition cursor-pointer"
                >
                    {stageFilter?.includes(Stage.FINISHED) ? (
                        <span className="flex flex-row justify-center items-center gap-2">
                            <X size={15} />
                            Finished
                        </span>
                    ) : (
                        'Finished'
                    )}
                </div>
                <div
                    onClick={() =>
                        handleStageFilter(Stage.PRODUCTION)
                    }
                    className="flex flex-row justify-between items-center w-fit h-fit bg-slate-100 rounded-md py-2 px-4 border-slate-200 border-2
                                hover:bg-slate-200 transition cursor-pointer"
                >
                    {stageFilter?.includes(Stage.PRODUCTION) ? (
                        <span className="flex flex-row justify-center items-center gap-2">
                            <X size={15} />
                            Production
                        </span>
                    ) : (
                        'Production'
                    )}
                </div>
            </div>
            <div className="flex flex-row gap-2" id="github-filter">
                {hasGithubFilter !== null && hasGithubFilter ? (
                    <div
                        onClick={handleChangeWithSearch(
                            handleSetGithubTrue
                        )}
                        className="flex justify-between items-center w-fit h-fit bg-emerald-300 rounded-md py-2 px-4 border-emerald-300 border-2
                                hover:bg-emerald-400 transition cursor-pointer"
                    >
                        Github
                    </div>
                ) : (
                    <div
                        onClick={handleChangeWithSearch(
                            handleSetGithubTrue
                        )}
                        className="flex justify-between items-center w-fit h-fit bg-emerald-200 rounded-md py-2 px-4 border-emerald-300 border-2
                                hover:bg-emerald-300 transition cursor-pointer"
                    >
                        Github
                    </div>
                )}
                {hasGithubFilter !== null && !hasGithubFilter ? (
                    <div
                        onClick={handleChangeWithSearch(
                            handleSetGithubFalse
                        )}
                        className="flex justify-between items-center w-fit h-fit bg-red-300 rounded-md py-2 px-4 border-red-300 border-2
                                hover:bg-red-400 transition cursor-pointer"
                    >
                        No Github
                    </div>
                ) : (
                    <div
                        onClick={handleChangeWithSearch(
                            handleSetGithubFalse
                        )}
                        className="flex justify-between items-center w-fit h-fit bg-red-200 rounded-md py-2 px-4 border-red-300 border-2
                                hover:bg-red-300 transition cursor-pointer"
                    >
                        No Github
                    </div>
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
