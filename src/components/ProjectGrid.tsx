import { ProjectType } from '@/models/Project/types'
import { Ref, lazy } from 'react'

const ProjectCard = lazy(() => import('./ProjectCard'))

interface ProjectGridProps {
    projects: ProjectType[]
    mRef?: Ref<HTMLDivElement> | null
}

// When Cards span to the second row, gridbox breaks down
// Third and up works OK

export default async function ProjectGrid({
    projects,
    mRef,
}: ProjectGridProps) {
    // Change the props-drilling approach !!!

    return (
        <div
            id="catalog"
            className="grid grid-flow-row-dense grid-cols-4 p-5 gap-4 grid-wrap bg-white overflow-y-auto rounded-lg h-full w-full font-medium border-gradient-to-r from-slate-150 to-slate-50 border-2"
        >
            {projects.map((p) => {
                return <ProjectCard key={p.id} project={p} />
            })}
            <div ref={mRef}></div>
        </div>
    )
}
