import { Button } from '@/components/ui/button'
import { UserMinus, UserPlus } from 'lucide-react'
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
            <div className="flex justify-center items-center">
                <Button
                    type="submit"
                    className="cursor-pointer inline-flex sm:py-4 sm:px-6 py-2 px-3 text-sm font-medium justify-center items-center"
                >
                    {!isFollowed ? (
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
                    ) : (
                        <UserMinus
                            className="w-5 h-5 me-2"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            aria-hidden="true"
                            fill="none"
                            viewBox="0 0 22 24"
                        />
                    )}
                    <p className="w-0 sm:w-full collapse sm:visible">
                        {!isFollowed
                            ? 'Support Project'
                            : 'Unsupport Project'}
                    </p>
                </Button>
            </div>
        </form>
    )
}

export default SupportButton
