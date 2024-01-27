import { ProjectType } from '@/models/Project/types'
import { UserRepo } from '@/services/octokit/types'
import RepoContainer from './RepositoryContainer'
import ProjectGrid from '@/components/ProjectGrid'

interface ProjectDashboardProps {
    repos: UserRepo[]
    projects: ProjectType[]
}

export default function ProjectDashboard({
    repos,
    projects,
}: ProjectDashboardProps) {
    return (
        <div id="projects-repos" className="flex flex-row h-full w-full mt-5">
            <div className="flex flex-col justify-center items-center rounded-lg h-full w-full font-medium bg-gray-100 mr-5">
                <ProjectGrid projects={projects} />
            </div>
            <div className="flex flex-col justify-center items-center rounded-lg h-full w-full font-medium ml-5">
                <RepoContainer repos={repos} />
            </div>
        </div>
    )
}
