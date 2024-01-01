import { Github } from 'lucide-react'

interface UserSectionProps {
    image?: string | null
    name?: string | null
    id: string
}

export default function UserSectionComponent({
    image,
    name,
    id,
}: UserSectionProps) {
    return (
        <div
            id="user"
            className="rounded-lg h-[400px] bg-gradient-to-r from-slate-100 to-white w-[500px] border-2 border-gray-100"
        >
            <div className="flex flex-row w-full m-6">
                <div id="profile-picture h-36 w-36">
                    <img
                        className="rounded-xl h-36 w-36 object-contain"
                        src={image!}
                    />
                </div>
                <div id="profile-info" className="flex flex-col m-6 mt-10">
                    <div className="flex flex-row items-center">
                        <Github size="22px" className="mr-2" />
                        <h1 className="text-2xl font-medium">{name}</h1>
                    </div>
                    <h2 className="text-sm text-slate-500">{id}</h2>
                </div>
            </div>
            <div
                id="follower-projects-info"
                className="grid grid-flow-col grid-cols-4 w-full mt-6"
            >
                <div className="col-span-1 flex flex-col items-center">
                    <h1 className="font-medium">Followers</h1>
                    <h2>100</h2>
                </div>
                <div className="col-span-1 flex flex-col items-center">
                    <h1 className="font-medium">Projects</h1>
                    <h2>4</h2>
                </div>
                <div className="col-span-1 flex flex-col items-center">
                    <h1 className="font-medium">Favorites</h1>
                    <h2>49</h2>
                </div>
                <div className="col-span-1 flex flex-col items-center">
                    <h1 className="font-medium">Repos</h1>
                    <h2>5</h2>
                </div>
            </div>
        </div>
    )
}