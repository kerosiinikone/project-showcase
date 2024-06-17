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
        <div className="overflow-x-auto border-2 p-2 rounded-lg overflow-y-auto">
            <Table className="bg-white h-full font-medium">
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
                                <TableCell
                                    className="w-[100px]"
                                    key={repo.id}
                                >
                                    <h3 className="text-md text-gray-500 truncate w-3/4">
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
        </div>
    )
}
