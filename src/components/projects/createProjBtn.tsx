import { useState } from "react";
import CreateProjPopup from "./createProjPopup";

export default function CreateProjBtn() {
    const [openCreateProjectPopup, setOpenCreateProjectPopup] = useState(false);
    return (
        <>
            <button onClick={() => { setOpenCreateProjectPopup(true) }} className="bg-[#ff5722] text-white px-4 py-1 rounded hover:bg-[#e64a19] transition duration-300 ease-in-out">Create Project</button>
            <CreateProjPopup openCreateProjectPopup={openCreateProjectPopup} setOpenCreateProjectPopup={setOpenCreateProjectPopup} />
        </>
    )
} 