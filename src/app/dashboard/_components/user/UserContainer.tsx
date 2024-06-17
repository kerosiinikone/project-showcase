import { UserType } from '@/models/User/types'
import { Github } from 'lucide-react'
import UserSupportCount from '../modal-list/UserSupportCount'
import AggregatedSupports from '../modal-list/AggregatedSupports'
import OwnProjectCounter from '../OwnProjectCounter'
import UserDetailField from './UserDetailField'
import UserBio from './UserBio'

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
            className="rounded-lg bg-white xl:w-full w-3/4 font-medium border-gradient-to-r from-slate-150 to-slate-50 border-2"
        >
            <div
                id="profile-data"
                className="flex md:flex-row flex-col p-4 border-b-2 rounded-lg bg-gradient-to-r from-slate-150 to-slate-50"
            >
                <UserDetailField id={id} name={name} image={image} />
                <UserBio content={userBio} />
            </div>
            <div
                id="follower-projects-info"
                className="flex flex-row mx-4 my-2 justify-around items-center"
            >
                <AggregatedSupports supports={aggregatedSupports} />
                <OwnProjectCounter
                    count={user?.own_projects?.length ?? 0}
                />
                <UserSupportCount
                    supports={user?.supported_projects?.length ?? 0}
                />
            </div>
        </div>
    )
}
