import { ProjectTypeWithId } from '@/models/Project/types'
import { lazy } from 'react'
import { Skeleton } from './ui/skeleton'

const ProjectCard = lazy(() => import('./ProjectCard'))

interface ProjectGridProps {
    projects: ProjectTypeWithId[]
    onBottom: (e: any) => void
    pending: boolean
}

export default function ProjectGrid({
    projects,
    onBottom,
    pending,
}: ProjectGridProps) {
    return (
        <div
            id="catalog"
            className={
                'container mx-auto auto-rows-min grid gap-4 p-5 bg-white overflow-y-auto rounded-lg h-full max-h-full w-full font-medium border-gradient-to-r from-slate-150 to-slate-50 border-2  grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 w-full'
            }
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
