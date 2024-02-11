import { UserType } from '@/models/User/types'
import { Github } from 'lucide-react'
import UserSupportCount from './modal-list/UserSupportCount'

interface UserSectionProps {
    image?: string | null
    name?: string | null
    id: string
    userBio: string
    user: UserType
    aggregatedSupports: number
}

export default function UserSectionComponent({
    image,
    name,
    id,
    userBio,
    user,
    aggregatedSupports,
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
                className="grid grid-flow-col gap-10 grid-cols-3 w-full mx-4 my-2 justify-center justify-items-center items-center"
            >
                <div className="col-span-1 flex flex-col px-10 py-2 w-fit items-center justify-center cursor-pointer rounded-lg hover:bg-slate-100 transition">
                    <h1 className="font-medium">Supports</h1>
                    <h2>{aggregatedSupports}</h2>
                </div>
                <div className="col-span-1 flex flex-col px-10 py-2 w-fit items-center justify-center cursor-pointer rounded-lg hover:bg-slate-100 transition">
                    <h1 className="font-medium">Own Projects</h1>
                    <h2>{user?.own_projects?.length}</h2>
                </div>
                <UserSupportCount
                    supports={user?.supported_projects?.length}
                />
            </div>
        </div>
    )
}
