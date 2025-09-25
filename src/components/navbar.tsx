import MenuIcon from '@mui/icons-material/Menu';
import { AccessRequest } from '../api/accessRequests';
import { useEffect, useState } from 'react';
import { useAccessRequest } from '../context/accessRequestsProvider';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsIcon from '@mui/icons-material/Settings';
import { toast } from 'react-toastify';
import { Switch } from '@headlessui/react'
import { useAuth } from '../auth/authProvider';
import LogoutIcon from '@mui/icons-material/Logout';
export default function Navbar({ isOpen, setIsOpen, size }: { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; size: boolean }) {
    const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([]);
    const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
        const stored = localStorage.getItem("soundEnabled");
        return stored ? JSON.parse(stored) : false;
    });
    const [seenIds, setSeenIds] = useState<string[]>(() => {
        const stored = localStorage.getItem("seenRequestIds");
        return stored ? JSON.parse(stored) : [];
    });
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const acc = useAccessRequest();
    const auth = useAuth();

    function toggleSideBar() {
        if (isOpen)
            setIsOpen(false)
        else
            setIsOpen(true)

    }


    useEffect(() => {
        localStorage.setItem("soundEnabled", JSON.stringify(soundEnabled));
    }, [soundEnabled]);


    useEffect(() => {
        const interval = setInterval(async () => {
            // Always read latest seenIds from localStorage
            const stored = localStorage.getItem("seenRequestIds");
            console.log("Stored seen IDs:", stored);
            const currentSeenIds: string[] = stored ? JSON.parse(stored) : [];

            // Fetch latest external requests
            await acc.getExternalRequests();
            const data: AccessRequest[] = acc.externalAccessRequests || [];

            // Get only pending
            const newPending = data.filter((req) => req.status === "PENDING");
            console.log("Pending requests:", newPending);
            // Find unseen requests
            const unseen = newPending.filter(
                (req) => !currentSeenIds.includes(req.id)
            );

            if (unseen.length > 0 && soundEnabled) {
                unseen.forEach((req) => {
                    const audio = new Audio("/notification.mp3");
                    audio.play().catch((err) => console.warn("Audio play blocked:", err));
                    // alert(`New pending request from ${req.organization}`);
                });

                // Mark unseen as seen (update both state + localStorage)
                const updatedSeen = [...currentSeenIds, ...unseen.map((u) => u.id)];
                setSeenIds(updatedSeen);
                localStorage.setItem("seenRequestIds", JSON.stringify(updatedSeen));
            }

            setPendingRequests(newPending);
        }, 10000); // poll every 10s

        return () => clearInterval(interval);
    }, [acc, soundEnabled]);


    return (
        <div className="w-full h-[8%] bg-[#15283c] flex items-center   justify-between">
            <div className='md:flex hidden h-full aspect-square  bg-[#ff5722]  items-center justify-center mr-2'>
                <p className="text-white font-bold">{auth.userData?.organizationName ? auth.userData?.organizationName : "DAMP"}</p>
            </div>
            <div onClick={() => toggleSideBar()} className='md:hidden h-full aspect-square cursor-pointer bg-[#ff5722] flex items-center justify-center mr-2'>
                <MenuIcon onClick={() => toggleSideBar()} className="md:hidden  block text-white cursor-pointer " ></MenuIcon>
            </div>

            {/* <p className="text-white font-bold sm:hidden static">DAMP</p> */}

            <div className='flex items-center'>
                <div className='relative w-fit  px-3'>
                    <div className='relative h-fit w-fit'>
                        <NotificationsNoneIcon
                            className="text-white cursor-pointer"
                            onClick={() => setShowNotifications((prev) => !prev)}
                        />
                        {pendingRequests.length > 0 && (
                            <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                                {pendingRequests.length}
                            </div>
                        )}
                    </div>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl p-4 text-black z-10">
                            <p className="font-semibold mb-2">Notifications</p>
                            {/* Example static notifications – replace with your pendingRequests */}
                            <ul className="space-y-1 text-sm">
                                {pendingRequests.length === 0 && <li>No new requests</li>}
                                {pendingRequests.map((req) => (
                                    <li key={req.id} className="border-b pb-1">
                                        Request from {req.organization}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className='relative w-fit  px-3'>
                    <SettingsIcon
                        className="text-white cursor-pointer"
                        onClick={() => setShowSettings((prev) => !prev)}
                    />
                    {showSettings && (
                        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl p-4 text-black">
                            <p className="font-semibold mb-2">Settings</p>
                            {/* Example static notifications – replace with your pendingRequests */}
                            <ul className="space-y-1 text-sm">

                                <li className="border-b pb-1 flex items-center ">
                                    <span className="mr-2">Sound Notifications</span>
                                    <Switch
                                        checked={soundEnabled}
                                        onChange={setSoundEnabled}
                                        className={`${soundEnabled ? 'bg-blue-600' : 'bg-gray-200'
                                            } relative inline-flex h-6 w-11 items-center rounded-full`}
                                    >
                                        <span className="sr-only">Enable notifications</span>
                                        <span
                                            className={`${soundEnabled ? 'translate-x-6' : 'translate-x-1'
                                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                        />
                                    </Switch>
                                </li>
                                <li className="border-b pb-1 flex items-center ">
                                    <div onClick={() => { auth.logOut() }} className="mt-2  flex cursor-pointer rounded-2xl items-center">
                                        <LogoutIcon className="text-[#e91e63]"></LogoutIcon>
                                        <a className="pl-4">Logout</a>
                                    </div>
                                </li>


                            </ul>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}
