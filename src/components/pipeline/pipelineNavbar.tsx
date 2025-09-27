import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
export default function PipelineNavbar() {
    const nav = useNavigate();
    return (
        <div className="w-full h-[8%] bg-[#214162] flex items-center   justify-between px-4 border-b-2 border-[#ff5722]">
            <div onClick={() => { nav(-1) }} className=" text-white flex cursor-pointer hover:text-white rounded-2xl  items-center">
                <ArrowBackIcon className="text-[#ff5722]"></ArrowBackIcon>
                {/* <a className="pl-4">Back</a> */}
            </div>
        </div>
    )
}