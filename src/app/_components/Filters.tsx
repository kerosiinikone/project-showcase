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
        //and skipping some ticks

        setTimeout(() => {
            initSearch()
        }, 500)
    }

    return (
        <div className="flex flex-row w-full justify-start my-4 gap-6">
            <div className="flex flex-row gap-2" id="stage-filter">
                <div
                    onClick={() => handleStageFilter(Stage.IDEA)}
                    className="flex justify-between items-center w-100 h-fit bg-slate-100 rounded-md py-2 px-4 border-slate-200 border-2
                                hover:bg-slate-200 transition"
                >
                    {stageFilter?.includes(Stage.IDEA) ? (
                        <span>
                            <X size={15} />
                            Idea
                        </span>
                    ) : (
                        'Idea'
                    )}
                </div>
                <div
                    onClick={() => handleStageFilter(Stage.PLAN)}
                    className="flex justify-between items-center w-100 h-fit bg-slate-100 rounded-md py-2 px-4 border-slate-200 border-2
                                hover:bg-slate-200 transition"
                >
                    {stageFilter?.includes(Stage.PLAN) ? (
                        <span>
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
                    className="flex justify-between items-center w-100 h-fit bg-slate-100 rounded-md py-2 px-4 border-slate-200 border-2
                                hover:bg-slate-200 transition"
                >
                    {stageFilter?.includes(Stage.DEVELOPMENT) ? (
                        <span>
                            <X size={15} />
                            Development
                        </span>
                    ) : (
                        'Development'
                    )}
                </div>
                <div
                    onClick={() => handleStageFilter(Stage.FINISHED)}
                    className="flex justify-between items-center w-100 h-fit bg-slate-100 rounded-md py-2 px-4 border-slate-200 border-2
                                hover:bg-slate-200 transition"
                >
                    {stageFilter?.includes(Stage.FINISHED) ? (
                        <span>
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
                    className="flex justify-between items-center w-100 h-fit bg-slate-100 rounded-md py-2 px-4 border-slate-200 border-2
                                hover:bg-slate-200 transition"
                >
                    {stageFilter?.includes(Stage.PRODUCTION) ? (
                        <span>
                            <X size={15} />
                            Production
                        </span>
                    ) : (
                        'Production'
                    )}
                </div>
            </div>
            <div className="flex flex-row gap-2" id="github-filter">
                <div
                    className="flex justify-between items-center w-100 h-fit bg-emerald-200 rounded-md py-2 px-4 border-emerald-300 border-2
                                hover:bg-emerald-300 transition"
                >
                    Github
                </div>
                <div
                    className="flex justify-between items-center w-100 h-fit bg-red-100 rounded-md py-2 px-4 border-red-200 border-2
                                hover:bg-red-300 transition"
                >
                    No Github
                </div>
            </div>
            <input
                name="stageFilter"
                value={JSON.stringify(stageFilter)}
                readOnly
                hidden
            />
            <input
                name="githubFilter"
                value={undefined}
                readOnly
                hidden
            />
        </div>
    )
}
