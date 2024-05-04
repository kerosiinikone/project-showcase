import { UserPlus } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface SupportButtonProps {
    uid: string
    pid: number
    unsupportWithParams: (payload: FormData) => void
    supportWithParams: (payload: FormData) => void
    setIsFollowedState: Dispatch<SetStateAction<boolean>>
    isFollowed: boolean
}

const SupportButton = ({
    isFollowed,
    setIsFollowedState,
    unsupportWithParams,
    supportWithParams,
}: SupportButtonProps) => {
    return (
        <form
            onSubmit={() => {
                setIsFollowedState(!isFollowed)
            }}
            action={
                isFollowed ? unsupportWithParams : supportWithParams
            }
        >
            <div className="flex justiyf-center items-center">
                <button
                    type="submit"
                    className="cursor-pointer inline-flex py-4 px-6 text-sm font-medium justify-center items-center bg-white border-2 border-blue-500 rounded-lg 
            group hover:bg-blue-100 text-blue-500 transition"
                >
                    <UserPlus
                        className="w-5 h-5 me-2"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 22 24"
                    />
                    {!isFollowed
                        ? 'Support Project'
                        : 'Unsupport Project'}
                </button>
            </div>
        </form>
    )
}

export default SupportButton
