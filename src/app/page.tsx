import { Suspense } from 'react'
import ProjectContainer from '../components/ProjectContainer'
import SearchBaComponent from './_components/SearchBar'
import { getProjectsServer } from '@/services/trpc/server'

// SSR vs. tRPC Caller ???
// Proper Loader -> Skeleton ?

export default async function MainComponent() {
    const initialProjects = await getProjectsServer()

    return (
        <div className="container h-screen w-screen flex justify-center items-center p-10">
            <div className="flex flex-col gap-4 h-full w-full">
                <div id="info" className="rounded-lg font-medium h-32">
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex flex-col justify-center items-center h-full w-full">
                            <h1 className="text-2xl">Community Projects</h1>
                            <div className="border-t-2 py-4 border-slate-200 w-64"></div>
                        </div>
                    </div>
                </div>
                <div className="h-fit">
                    <SearchBaComponent />
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <ProjectContainer projects={initialProjects} />
                </Suspense>
            </div>
        </div>
    )
}
