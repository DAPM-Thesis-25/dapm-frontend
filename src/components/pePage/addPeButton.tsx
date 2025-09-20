/**
 * Author:
 * - Mahdi El Dirani s233031
 * 
 * Description:
 * Button to open Add Member Dialog
 */
import { useState } from "react";
import ProcessingElementPopup from "./addPePopup";



export default function AddPeButton() {
    const [openProcessingElementPopup, setOpenProcessingElementPopup] = useState(false);

    return (
        <>
            <button onClick={()=>{setOpenProcessingElementPopup(true)}} className="bg-[#ff5722] text-white px-4 py-1 rounded hover:bg-[#e64a19] transition duration-300 ease-in-out">Add Processing Element</button>
            <ProcessingElementPopup openProcessingElementPopup={openProcessingElementPopup} setOpenProcessingElementPopup={setOpenProcessingElementPopup}/>
        </>
    )
}