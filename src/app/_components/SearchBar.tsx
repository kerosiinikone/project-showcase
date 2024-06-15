'use client'

import { useRef, useState } from 'react'
import { DebounceInput } from 'react-debounce-input'
import SearchButton from './ui/SearchButton'

// Move hidden inputs to ProjectContainer

interface SearchBarProps {
    handleSearch: () => void
    addTag: (tag: string) => void
}

const REG = /^[a-zA-Z]+$/

const SearchBarComponent = ({
    handleSearch,
    addTag,
}: SearchBarProps) => {
    const inputRef = useRef<any>(null) // For now

    return (
        <>
            <div className="relative w-full bg-white">
                <DebounceInput
                    minLength={4}
                    ref={inputRef}
                    onKeyDown={(
                        e: React.KeyboardEvent<HTMLInputElement> & {
                            target: {
                                value: string
                            }
                        }
                    ) => {
                        if (e.code === 'Enter') {
                            const query = e.target.value
                            e.preventDefault()
                            if (REG.test(query) && query.length > 0) {
                                addTag(query)
                                setTimeout(() => {
                                    handleSearch()
                                    inputRef.current.value = ''
                                }, 100)
                            }
                        }
                    }}
                    onChange={(e) => {
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
            <SearchButton
                handleSearch={handleSearch}
                inputRef={inputRef}
            />
        </>
    )
}

export default SearchBarComponent
