import { Pencil } from 'lucide-react'

const SubmitButton = () => {
    return (
        <div>
            <div className="flex justify-center items-center">
                <button
                    type="submit"
                    className="cursor-pointer inline-flex py-4 px-6 text-sm font-medium justify-center items-center bg-emerald-500 border-2 border-emerald-500 rounded-lg 
            hover:bg-emerald-600 text-white transition"
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
                </button>
            </div>
        </div>
    )
}

export default SubmitButton
