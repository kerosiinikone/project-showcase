import { UserType } from '@/models/User/types'
import { Github } from 'lucide-react'

interface UserSectionProps {
    image?: string | null
    name?: string | null
    id: string
    userBio: string
    user: UserType
}

export default function UserSectionComponent({
    image,
    name,
    id,
    userBio,
    user,
}: UserSectionProps) {
    return (
        <div
            id="user"
            className="rounded-lg bg-white w-full font-medium border-gradient-to-r from-slate-150 to-slate-50 border-2"
        >
            <div
                id="profile-data"
                className="flex flex-row p-4 border-b-2 rounded-lg bg-gradient-to-r from-slate-150 to-slate-50"
            >
                <div id="profile-picture h-36 w-36">
                    <img
                        className="rounded-xl h-36 w-36 object-contain"
                        src={image!}
                    />
                </div>
                <div
                    id="profile-info"
                    className="flex flex-col m-6 mt-10"
                >
                    <div className="flex flex-row items-center">
                        <Github size="22px" className="mr-2" />
                        <h1 className="text-2xl font-medium">
                            {name}
                        </h1>
                    </div>
                    <h2 className="text-sm text-slate-500">{id}</h2>
                </div>
                <div id="bio" className="flex flex-col m-6 mt-10">
                    <h1>Bio</h1>
                    <h2 className="text-md text-slate-500">
                        {userBio}
                    </h2>
                </div>
            </div>
            <div
                id="follower-projects-info"
                className="grid grid-flow-col grid-cols-4 w-full m-4 justify-center items-center"
            >
                <div className="col-span-1 flex flex-col items-center">
                    <h1 className="font-medium">Supports</h1>
                    <h2>100</h2>
                </div>
                <div className="col-span-1 flex flex-col items-center">
                    <h1 className="font-medium">Own Projects</h1>
                    <h2>{user?.own_projects?.length}</h2>
                </div>
                <div className="col-span-1 flex flex-col items-center">
                    <h1 className="font-medium">
                        Supported Projects
                    </h1>
                    <h2>{user?.supported_projects?.length}</h2>
                </div>
            </div>
        </div>
    )
}
