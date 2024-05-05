import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { HTMLProps } from 'react'

const SearchButton = (_: HTMLProps<HTMLButtonElement>) => (
    <Button
        type="submit"
        variant="secondary"
        className="cursor-pointer inline-flex py-2.5 px-3 ms-2 justify-center items-center"
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

export default SearchButton
