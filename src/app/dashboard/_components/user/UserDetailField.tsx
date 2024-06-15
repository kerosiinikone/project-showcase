import { Github } from 'lucide-react'
import Image from 'next/image'

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
        <>
            <div id="profile-picture h-36 w-36">
                <Image
                    alt="Profile pricture"
                    width={116}
                    height={116}
                    className="rounded-xl"
                    src={image!}
                />
            </div>
            <div
                id="profile-info"
                className="flex flex-col m-6 mt-10"
            >
                <div className="flex flex-row items-center">
                    <Github size="22px" className="mr-2" />
                    <h1 className="text-2xl font-medium">{name}</h1>
                </div>
                <h2 className="text-sm text-slate-500">{id}</h2>
            </div>
        </>
    )
}

export default UserDetailField
