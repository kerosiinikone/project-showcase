export default function SearchBaComponent() {
    return (
        <form className="flex items-center">
            <div className="relative w-full bg-white">
                <input
                    type="text"
                    id="search"
                    className="bg-white border-gray-300 border-2 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    placeholder="Discover new projects and ideas..."
                />
            </div>
            <button
                type="submit"
                className="cursor-pointer inline-flex py-2.5 px-3 ms-2 text-sm font-medium justify-center items-center bg-white border-2 border-blue-500 rounded-lg 
            group hover:bg-blue-100 text-blue-500 transition"
            >
                <svg
                    className="w-4 h-4 me-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                </svg>
                Search
            </button>
        </form>
    )
}
