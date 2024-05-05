import { Button } from '@/components/ui/button'
import { Delete, Pencil } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

const DeleteButton = ({
    setIsDelete,
    isDelete,
}: {
    isDelete: boolean
    setIsDelete: Dispatch<SetStateAction<boolean>>
}) => {
    // Opens a modal to edit the project -> redirects to the project page

    return (
        <div>
            {!isDelete ? (
                <div className="flex justify-center items-center">
                    <Button
                        onClick={(e) => {
                            e.preventDefault()
                            setIsDelete(true)
                        }}
                        className="cursor-pointer inline-flex py-4 px-6 text-sm font-medium justify-center items-center bg-red-500 border-2 border-red-500 rounded-lg 
            group hover:bg-red-600 hover:border-red-600 text-white"
                    >
                        <Delete
                            className="w-5 h-5 me-2"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            aria-hidden="true"
                            fill="none"
                            viewBox="0 0 22 24"
                        />
                        Delete
                    </Button>
                </div>
            ) : (
                <div className="flex justify-center items-center">
                    <Button
                        className="cursor-pointer inline-flex py-4 px-6 text-sm font-medium justify-center items-center bg-red-500 border-2 border-red-500 rounded-lg 
            group hover:bg-red-600 hover:border-red-600 text-white"
                    >
                        <Pencil
                            className="w-5 h-5 me-2"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            aria-hidden="true"
                            fill="none"
                            viewBox="0 0 22 24"
                        />
                        Confirm
                    </Button>
                </div>
            )}
        </div>
    )
}

export default DeleteButton
