import { UserRepo } from '@/services/github'
import { Github } from 'lucide-react'

interface RepoContainerProps {
    repos: UserRepo[]
}

export default function RepoContainer({ repos }: RepoContainerProps) {
    return (
        <>
            <ul className="p-5 bg-white rounded-lg h-full w-full font-medium border-gradient-to-r from-slate-150 to-slate-50 border-2">
                {repos.map((repo) => {
                    return (
                        <li
                            key={repo.id}
                            className="p-4 border-2 border-slate-150 rounded-lg shadow-md"
                        >
                            <div className="flex flex-row justify-start items-center space-x-4">
                                <Github />
                                <div className="flex flex-col justify-start items-center">
                                    <div className="flex flex-row justify-start items-center gap-2 w-full">
                                        <h1 className="text-xl font-medium text-gray-900 truncate">
                                            {repo.name}
                                        </h1>
                                        <h3 className="text-md text-gray-300 truncate">
                                            {repo.id}
                                        </h3>
                                    </div>
                                    <div className="flex">
                                        <h3 className="text-md text-gray-500 truncate">
                                            {repo.github_url}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}
