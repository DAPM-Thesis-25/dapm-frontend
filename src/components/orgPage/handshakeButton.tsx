/**
 * Author:
 * - Mahdi El Dirani s233031
 * 
 * Description:
 * Button to open Add Member Dialog
 */
import { Button } from "@mui/material";
import { useState } from "react";
import HandshakePopup from "./handshakePopup";



export default function HandshakeButton() {
    const [openHandshakePopup, setOpenHandshakePopup] = useState(false);

    return (
        <>
            <button onClick={()=>{setOpenHandshakePopup(true)}} className="bg-[#ff5722] text-white px-4 py-1 rounded hover:bg-[#e64a19] transition duration-300 ease-in-out">Handshake Request</button>
            <HandshakePopup openHandshakePopup={openHandshakePopup} setOpenHandshakePopup={setOpenHandshakePopup}/>
        </>
    )
}