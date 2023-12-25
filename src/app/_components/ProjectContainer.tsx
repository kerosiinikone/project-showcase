import { lazy } from 'react'

const ProjectCard = lazy(() => import('./ProjectCard'))

export default function ProductContainerComponent() {
    return (
        <div
            id="catalog"
            className="bg-white overflow-y-auto rounded-lg h-full w-full font-medium border-gradient-to-r from-slate-150 to-slate-50 border-2"
        >
            <div className="grid grid-flow-row-dense grid-cols-4 h-full w-full p-5 gap-4 grid-wrap">
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
            </div>
        </div>
    )
}
