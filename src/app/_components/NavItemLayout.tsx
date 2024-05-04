import Link from 'next/link'

type NavItemLayoutProps = {
    title: string
    site: string
} & React.PropsWithChildren

const NavItemLayout = ({
    children,
    title,
    site,
}: NavItemLayoutProps) => {
    return (
        <li>
            <Link
                className="flex items-center p-2 text-gray-700 hover:text-gray-900 rounded-lg group"
                href={`/${site}`}
            >
                {children}
                <span className="ms-3">{title}</span>
            </Link>
        </li>
    )
}

export default NavItemLayout
