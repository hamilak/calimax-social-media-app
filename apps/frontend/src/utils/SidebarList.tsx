import {
    RiUser2Fill,
    RiUser2Line,
    RiHomeHeartFill,
    RiHomeHeartLine,
    RiFileList2Fill,
    RiFileList2Line,
} from 'react-icons/ri'
import { RiStickyNoteLine } from 'react-icons/ri'
import { RiStickyNoteFill } from 'react-icons/ri'

interface SidebarListProps {
    label: string
    icon: JSX.Element
    clickedIcon: JSX.Element
    to: string
    roles: string
}

export const linksArray: SidebarListProps[] = [
    // {
    //     label: 'Home',
    //     icon: <RiDashboardLine />,
    //     clickedIcon: <RiDashboardHorizontalFill />,
    //     to: '/',
    //     roles: 'admin',
    // },
    {
        label: 'Home',
        icon: <RiHomeHeartLine />,
        clickedIcon: <RiHomeHeartFill />,
        to: '/home',
        roles: 'user',
    },
    {
        label: 'Explore',
        icon: <RiFileList2Line />,
        clickedIcon: <RiFileList2Fill />,
        to: '/explore',
        roles: 'user',
    },
    {
        label: 'Messages',
        icon: <RiStickyNoteLine />,
        clickedIcon: <RiStickyNoteFill />,
        to: '/messages',
        roles: 'user',
    },
    {
        label: 'Profile',
        icon: <RiUser2Line />,
        clickedIcon: <RiUser2Fill />,
        to: '/profile',
        roles: 'user',
    },
    // {
    //     label: 'Users',
    //     icon: <RiWalletLine />,
    //     clickedIcon: <RiWalletFill />,
    //     to: '/users',
    //     roles: 'admin',
    // },
]
