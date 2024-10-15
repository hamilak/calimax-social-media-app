import { FC } from 'react'
import { linksArray } from '../utils/SidebarList'
import { Link, useLocation } from 'react-router-dom'
import Image from '../assets/network-user-icon.png'
import { RiEdit2Line } from 'react-icons/ri'

interface SidebarProps {
    role?: string
}

const SideBar: FC<SidebarProps> = ({ role }) => {
    const location = useLocation()
    const filteredLinks = linksArray.filter((link) => role?.includes(link.roles))

    return (
        <div
            className={`flex flex-col h-screen w-56 bg-purple-800 text-white transition-width ease-in-out fixed z-10 pt-10`}
        >
            <div className='flex justify-center items-center my-10'>
                <Link to={'/profile'}>
                    <img src={Image} alt="pfp" width={100} height={100} />
                    <span className='float-right absolute right-16 top-40 bg-purple-800 rounded-full border-0 p-1'><RiEdit2Line size={16} /></span>
                </Link>
            </div>
            <div
                className={`flex-grow text-white w-56 `}
            >
                <div className="p-4">
                    <ul className="space-y-4">
                        {filteredLinks.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className={`flex flex-row gap-2 items-center hover:no-underline text-center py-2 px-4 rounded text-white hover:text-white ${location.pathname === link.to ? 'bg-purple-600' : 'hover:bg-purple-600'}`}
                                >
                                    {location.pathname === link.to
                                        ? link.clickedIcon
                                        : link.icon}
                                    <span className="ml-4 text-sm">
                                        {link.label}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SideBar
