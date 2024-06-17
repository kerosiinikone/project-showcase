import { Github } from 'lucide-react'

const UserDetailField = ({
    image,
    name,
    id,
}: {
    image?: string | null
    name?: string | null
    id: string
}) => {
    return (
        <div className="flex flex-row">
            <div
                id="profile-picture"
                className="flex justify-center items-center shrink-0"
            >
                <img
                    alt="Profile pricture"
                    className="rounded-xl md:h-36 md:w-36 w-24 h-24"
                    src={image!}
                />
            </div>
            <div
                id="profile-info"
                className="flex flex-col m-6 mt-10"
            >
                <div className="flex flex-row items-center text-wrap truncate">
                    <Github size="22px" className="mr-2" />
                    <h1 className="text-2xl font-medium">{name}</h1>
                </div>
                <h2 className="text-sm text-slate-500">{id}</h2>
            </div>
        </div>
    )
}

export default UserDetailField
