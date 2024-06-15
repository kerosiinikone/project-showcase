import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { MutableRefObject } from 'react'

const SearchButton = ({
    handleSearch,
    inputRef,
}: {
    handleSearch: () => void
    inputRef: MutableRefObject<any>
}) => {
    return (
        <Button
            variant="secondary"
            className="cursor-pointer inline-flex py-2.5 px-3 ms-2 justify-center items-center"
            onClick={(e) => {
                e.preventDefault()

                const refValue = inputRef?.current.state.value

                if (inputRef && refValue.length > 0) {
                    handleSearch()
                }
            }}
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
        </Button>
    )
}

export default SearchButton
