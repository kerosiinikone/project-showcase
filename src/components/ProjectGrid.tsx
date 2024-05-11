import { ProjectTypeWithId } from '@/models/Project/types'
import { lazy } from 'react'
import { Skeleton } from './ui/skeleton'

const ProjectCard = lazy(() => import('./ProjectCard'))

interface ProjectGridProps {
    projects: ProjectTypeWithId[]
    onBottom: (e: any) => void
    pending: boolean
    cols?: number
}

export default function ProjectGrid({
    projects,
    onBottom,
    cols = 4,
    pending,
}: ProjectGridProps) {
    const withGridSize = `grid grid-flow-row-dense grid-cols-${cols} grid-rows-[repeat(4,_1fr)] p-5 md:gap-4 sm:gap-2 grid-wrap bg-white overflow-y-auto rounded-lg h-full w-full font-medium border-gradient-to-r from-slate-150 to-slate-50 border-2`

    return (
        <div
            id="catalog"
            className={withGridSize}
            onScroll={onBottom}
        >
            {projects.map((p) => {
                return <ProjectCard key={p.alt_id} project={p} />
            })}
            {pending &&
                [...'x'.repeat(5).split('').keys()].map((_, i) => (
                    <Skeleton
                        key={i}
                        className="w-full h-full rounded-lg transition-all duration-300 animate-pulse"
                    />
                ))}
        </div>
    )
}
