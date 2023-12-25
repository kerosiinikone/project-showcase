import { Github } from 'lucide-react'

export default function ProjectCard() {
    return (
        <div
            id="project-card"
            className="cursor-pointer rounded-lg h-64 w-84 border-gray-300 row-span-5 border-2 bg-white"
        >
            <div className="flex flex-col h-full w-full p-5 justify-between">
                <div className="flex flex-col h-full w-full">
                    <h1 className="font-medium text-2xl">Project Showcase</h1>
                    <h2 id="status" className="font-normal text-emerald-300">
                        In Development
                    </h2>
                    <h2 className="font-normal my-4">
                        Showcase unreleased projects, ideas, finished products
                    </h2>
                </div>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col w-fit">
                        <span className="font-medium">Author</span>
                        <span className="font-normal">kerosiinikone</span>
                    </div>
                    <div
                        id="github-icon"
                        className="flex flex-col w-fit justify-end"
                    >
                        <Github />
                    </div>
                </div>
            </div>
        </div>
    )
}
