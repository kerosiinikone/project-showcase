import { X } from 'lucide-react'

export default function TagLabel({
    name,
    remove,
}: {
    name: string
    remove?: () => void
}) {
    return (
        <div
            className="flex items-center justify-center gap-2 flex-row w-max py-2 px-3 bg-blue-600 rounded-xl group cursor-pointer"
            onClick={remove}
        >
            <span className="group-hover:inline hidden">
                <X size={15} color="white" />
            </span>
            <h2 className="text-white font-medium text-sm">{name}</h2>
        </div>
    )
}
