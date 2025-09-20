/**
 * Author:
 * - Mahdi El Dirani s233031
 * 
 * Description:
 * Button to open Add Member Dialog
 */
import { Button } from "@mui/material";
import { useState } from "react";
import AddMemberPopup from "./AddMemberPopup";


export default function AddMemberButton() {
    const [openAddMemberPopup, setOpenAddMemberPopup] = useState(false);

    return (
        <>
            <button onClick={()=>{setOpenAddMemberPopup(true)}} className="bg-[#ff5722] text-white px-4 py-1 rounded hover:bg-[#e64a19] transition duration-300 ease-in-out">Add Member</button>
            <AddMemberPopup openAddMemberPopup={openAddMemberPopup} setOpenAddMemberPopup={setOpenAddMemberPopup}/>
        </>
    )
}