import { Github } from 'lucide-react'
import { signOutGithub } from '../../_actions/auth-action'
import { Button } from '@/components/ui/button'

const LogoutButton = () => {
    return (
        <form action={signOutGithub}>
            <Button
                type="submit"
                className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
            >
                <Github color="white" className="mr-5" />
                <span>Logout</span>
            </Button>
        </form>
    )
}

export default LogoutButton
