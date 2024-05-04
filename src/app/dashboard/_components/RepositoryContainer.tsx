import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { UserRepo } from '@/services/github'

interface RepoContainerProps {
    repos: UserRepo[]
}

export default function RepoContainer({ repos }: RepoContainerProps) {
    return (
        <>
            <Table className="p-5 bg-white rounded-lg h-full w-full font-medium border-2">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Link</TableHead>
                        <TableHead>ID</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {repos.map((repo) => {
                        return (
                            <TableRow key={repo.id}>
                                <TableCell>
                                    <h1 className="text-xl font-medium text-gray-900 truncate">
                                        {repo.name}
                                    </h1>
                                </TableCell>
                                <TableCell key={repo.id}>
                                    <h3 className="text-md text-gray-500 truncate">
                                        {repo.github_url}
                                    </h3>
                                </TableCell>
                                <TableCell key={repo.id}>
                                    <h3 className="text-md text-gray-300 truncate">
                                        {repo.id}
                                    </h3>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </>
    )
}
