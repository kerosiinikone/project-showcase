import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'

const SubmitButton = () => {
    return (
        <div>
            <div className="flex justify-center items-center">
                <Button
                    className="cursor-pointer inline-flex py-4 px-6 text-sm font-medium justify-center items-center bg-green-500 border-2 border-green-500 rounded-lg 
            group hover:bg-green-600 hover:border-green-600 text-white"
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
                    Submit
                </Button>
            </div>
        </div>
    )
}

export default SubmitButton
