import { useState } from "react";
import AssignUserPopup from "./assignPopup";

export default function AssignUserBtn() {
    const [openAssignUserPopup, setOpenAssignUserPopup] = useState(false);

    return (
        <>
            <button onClick={()=>{setOpenAssignUserPopup(true)}} className="bg-[#ff5722] text-white px-4 py-1 rounded hover:bg-[#e64a19] transition duration-300 ease-in-out">Assign User</button>
            <AssignUserPopup openAssignUserPopup={openAssignUserPopup} setOpenAssignUserPopup={setOpenAssignUserPopup}/>
        </>
    )
}