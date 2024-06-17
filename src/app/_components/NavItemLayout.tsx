import Link from 'next/link'
import { Dispatch, SetStateAction } from 'react'

type NavItemLayoutProps = {
    title: string
    site: string
    closeDrawer?: () => void
} & React.PropsWithChildren

/* eslint-disable */

const NavItemLayout = ({
    children,
    title,
    site,
    closeDrawer,
}: NavItemLayoutProps) => {
    const close = closeDrawer || function () {}
    return (
        <li>
            <Link
                className="flex items-center p-2 text-gray-700 hover:text-gray-900 rounded-lg group"
                href={`/${site}`}
                onClick={() => close()}
            >
                {children}
                <span className="ms-3">{title}</span>
            </Link>
        </li>
    )
}

export default NavItemLayout
