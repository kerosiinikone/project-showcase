import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'

const CreateProjectButton = ({
    fetch,
}: {
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
                <DialogTrigger asChild type="submit">
                    <Button type="submit">Create Project</Button>
                </DialogTrigger>
            </form>
        </div>
    )
}

export default CreateProjectButton
