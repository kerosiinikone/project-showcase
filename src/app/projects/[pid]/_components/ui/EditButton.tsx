import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Pencil } from 'lucide-react'

const EditButton = ({
    fetch,
}: {
    fetch: (payload: FormData) => void
}) => {
    return (
        <form action={fetch}>
            <div className="flex justify-center items-center">
                <DialogTrigger asChild type="submit">
                    <Button
                        type="submit"
                        variant="default"
                        className="cursor-pointer inline-flex py-4 px-6 text-sm font-medium justify-center items-center rounded-lg text-white"
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
                        Edit
                    </Button>
                </DialogTrigger>
            </div>
        </form>
    )
}

export default EditButton
