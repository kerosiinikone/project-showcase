import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'

const CreateProjectButton = ({
    open,
    fetch,
}: {
    open: () => void
    fetch: (payload: FormData) => void
}) => {
    // Fetch repos from GithubApp "on the server"
    // Cache also

    return (
        <div id="open-modal-form">
            <form
                action={fetch}
                className="flex justify-center items-center"
            >
                <DialogTrigger
                    type="submit"
                    onClick={open}
                    className="bg-blue-700 text-white hover:bg-blue-800 py-2 px-3 rounded-md font-medium text-sm"
                >
                    Create Project
                </DialogTrigger>
            </form>
        </div>
    )
}

export default CreateProjectButton
