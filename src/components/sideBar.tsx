import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/authProvider";
import TaskIcon from '@mui/icons-material/Task';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import GroupIcon from '@mui/icons-material/Group';
import ApartmentIcon from '@mui/icons-material/Apartment';
import TerminalIcon from '@mui/icons-material/Terminal';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import profile from "../imgs/profile.jpg";
export default function SideBar({ isOpen, size, setIsOpen }: { isOpen: boolean; size: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const auth = useAuth();
    const location = useLocation();
    const [pathname, setPathname] = useState(location.pathname);

    // this will be used to highlight the active link and later to check what nav items to show 
    useEffect(() => {
        setPathname(location.pathname);
        console.log(location.pathname);
        console.log(auth.token)
    }, [location.pathname]);


    function toggleSideBar() {
        if(size) {
        if (isOpen)
            setIsOpen(false)
        else
            setIsOpen(true)
    }
    }
    enum role {
        ADMIN = "ADMIN",
        USER = "MEMBER",
    }

    const navItems = [
        {
            label: "Overview",
            path: "/dashboard/overview",
            icon: <EqualizerIcon className="text-[#ff9800]" />,
            role: role.ADMIN,
        },
        {
            label: "Users",
            path: "/dashboard/users",
            icon: <GroupIcon className="text-[#ff5722]" />,
            role: role.ADMIN,
        },
        {
            label: "Partners",
            path: "/dashboard/partners",
            icon: <ApartmentIcon className="text-[#9427a9]" />,
            role: role.ADMIN,
        },
        {
            label: "Processing Elements",
            path: "/dashboard/processing-elements",
            icon: <TerminalIcon className="text-[#2196f3]" />,
            role: role.ADMIN,
        },
        {
            label: "Projects",
            path: "/dashboard/projects",
            icon: <AccountTreeIcon className="text-[#009688]" />,
            role: role.ADMIN,
        },
        {
            label: "Access Requests",
            path: "/dashboard/access-requests",
            icon: <AccountTreeIcon className="text-[#9427a9]" />,
            role: role.ADMIN,
        },
        {
            label: "My Projects",
            path: "/dashboard/projects",
            icon: <AccountTreeIcon className="text-[#009688]" />,
            role: role.USER,
        },
        {
            label: "Admins",
            path: "/dashboard/users",
            icon: <ApartmentIcon className="text-[#9427a9]" />,
            role: role.USER,
        },
    ];

    console.log(auth.userData?.orgRole);

    return (
        // bg-[url(./imgs/login-bg.jpg)]

        <div className={`xl:w-[20%] lg:w-[20%] md:w-[17%] h-full w-full   md:static transition-transform transform absolute z-10   bg-[#15283c] sidebar  ${ isOpen ? 'translate-x-0 ' : '-translate-x-full '} `}>
            <div className="text-center text-white sm:text-2xl font-bold sidebar-title text-5xl h-[14%] bg-[#214162] flex items-center px-6 md:static  w-full">
                <img src={profile} className="h-16 w-16 rounded-full lg:flex md:hidden flex" alt="logo" />
                <div className="flex flex-col items-start justify-center 2xl:ml-7 xl:ml-3 lg:ml-2 md:ml-0 ml-4">
                    <h3 className="2xl:text-xl xl:text-lg lg:text-lg md:text-sm text-lg">{auth.userData?.username[0].toUpperCase()}{auth.userData?.username.slice(1)} </h3>
                    <div className="text-sm font-normal flex items-center text-green-500">
                        <span className="relative flex h-2 w-2 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Online

                    </div>
                </div>
                <div className="absolute right-4 top-4 md:hidden">
                    <CloseIcon onClick={() => toggleSideBar()} className="text-white cursor-pointer"></CloseIcon>
                </div>
            </div>
            {/* <h3 className="text-center text-white sm:text-2xl font-bold sidebar-title text-5xl h-[10%] bg-[#214162] flex items-center justify-center">{auth.userData?.username}</h3> */}
            <div className="flex flex-col grow sm:pt-14 pt-20 lg:px-4 md:px-1 px-4 text-lg">
                {navItems
                .filter(item => item.role === auth.userData?.orgRole)
                .map(({ label, path, icon }) => (
                    <Link
                        key={path}
                        onClick={toggleSideBar}
                        to={path}
                        className={`mt-2 text-white flex cursor-pointer hover:text-white rounded-2xl px-2 py-3 items-center ${pathname === path ? "text-white bg-[#8758ff]" : ""
                            }`}
                    >
                        {icon}
                        <span className="pl-4">{label}</span>
                    </Link>
                ))}
                
                <div onClick={() => { auth.logOut() }} className="mt-2 text-white flex cursor-pointer hover:text-white rounded-2xl px-2 py-3 items-center">
                    <LogoutIcon className="text-[#e91e63]"></LogoutIcon>
                    <a className="pl-4">Logout</a>
                </div>
            </div>

        </div>
    )
}