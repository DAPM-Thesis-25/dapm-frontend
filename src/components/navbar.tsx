import MenuIcon from '@mui/icons-material/Menu';
export default function Navbar({ isOpen, setIsOpen, size }: { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; size: boolean }) {
    function toggleSideBar() {
        if (isOpen)
            setIsOpen(false)
        else
            setIsOpen(true)

    }
    return (
        <div className="w-full h-[8%] bg-[#15283c] flex items-center  fixed ">
            <div  className='md:flex hidden h-full aspect-square  bg-[#ff5722]  items-center justify-center mr-2'>
                {/* <MenuIcon onClick={() => toggleSideBar()} className="md:hidden  block text-white cursor-pointer " ></MenuIcon> */}
            <p className="text-white font-bold">DAMP</p>

            </div>
            <div onClick={() => toggleSideBar()} className='md:hidden h-full aspect-square cursor-pointer bg-[#ff5722] flex items-center justify-center mr-2'>
                <MenuIcon onClick={() => toggleSideBar()} className="md:hidden  block text-white cursor-pointer " ></MenuIcon>
            </div>

            <p className="text-white font-bold sm:hidden static">DAMP</p>
        </div>
    )
}
