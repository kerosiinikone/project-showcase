'use client'

import { Search } from 'lucide-react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { DebounceInput, DebounceInputProps } from 'react-debounce-input'

type InputProps = {
    className: string
    placeholder: string
    id: string
}

export default function SearchBaComponent() {
    const ref = useRef(null)
    const [searchInput, setSearchInput] = useState<string>('')

    useEffect(() => {
        // Handle active search
    }, [searchInput])

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                setSearchInput('')
            }}
            className="flex items-center"
        >
            <div className="relative w-full bg-white">
                <SearchInput
                    value={searchInput}
                    minLength={4}
                    debounceTimeout={300}
                    onChange={(e) => setSearchInput(e.target.value)}
                    id="search"
                    ref={ref}
                    className="bg-white border-gray-300 border-2 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    placeholder="Discover new projects and ideas..."
                />
            </div>
            <SearchButton />
        </form>
    )
}

const SearchInput = forwardRef<
    HTMLInputElement,
    DebounceInputProps<HTMLInputElement, InputProps>
>((props, ref) => (
    <div className="relative w-full bg-white">
        <DebounceInput inputRef={ref} {...props} />
    </div>
))

const SearchButton = () => (
    <button
        type="submit"
        className="cursor-pointer inline-flex py-2.5 px-3 ms-2 text-sm font-medium justify-center items-center bg-white border-2 border-blue-500 rounded-lg 
            group hover:bg-blue-100 text-blue-500 transition"
    >
        <Search
            className="w-4 h-4 me-2"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 20 20"
        />
        Search
    </button>
)
