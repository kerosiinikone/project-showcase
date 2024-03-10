'use client'

import { Search } from 'lucide-react'
import { HTMLProps, useState } from 'react'
import { DebounceInput } from 'react-debounce-input'

// Move hidden inputs to ProjectContainer

interface SearchBarProps {
    handleSearch: () => void
    addTag: (tag: string) => void
}

const SearchBarComponent = ({
    handleSearch,
    addTag,
}: SearchBarProps) => {
    const [dInput, setDInput] = useState<string>('')
    return (
        <>
            <div className="relative w-full bg-white">
                <DebounceInput
                    minLength={4}
                    value={dInput}
                    onKeyDown={(
                        e: React.KeyboardEvent<HTMLInputElement> & {
                            target: {
                                value: string
                            }
                        }
                    ) => {
                        if (e.code === 'Enter') {
                            e.preventDefault()
                            addTag(e.target.value)
                            setTimeout(() => {
                                handleSearch()
                                setDInput('')
                            }, 100)
                        }
                    }}
                    onChange={(e) => {
                        setDInput(e.target.value)
                        setTimeout(() => {
                            handleSearch()
                        }, 100)
                    }}
                    debounceTimeout={500}
                    id="query"
                    name="query"
                    className="bg-white border-gray-300 border-2 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    placeholder="Discover new projects and ideas..."
                />
            </div>
            <SearchButton />
        </>
    )
}

const SearchButton = (_: HTMLProps<HTMLButtonElement>) => (
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

export default SearchBarComponent
