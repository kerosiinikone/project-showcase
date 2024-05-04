import { Pencil } from 'lucide-react'
import Link from 'next/link'

const EditButton = ({ pid }: { pid: number }) => {
    return (
        <div>
            <div className="flex justify-center items-center">
                <Link
                    href={`/projects/${pid}/edit`}
                    className="cursor-pointer inline-flex py-4 px-6 text-sm font-medium justify-center items-center bg-white border-2 border-emerald-500 rounded-lg 
            group hover:bg-emerald-100 text-emerald-500 transition"
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
                </Link>
            </div>
        </div>
    )
}

export default EditButton
