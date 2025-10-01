import { useEffect, useState } from "react";
import Popup from "./popup";
interface PopupProps {
    // openPopup: boolean;
    // setOpenPopup: (value: boolean) => void;
    title: string;
    btnText: string;
    className?: string;
    children?: React.ReactNode;
    dialogClassName?: string;
    closePopupState?: boolean;
}
export default function BtnPopup({ title, btnText, className, children, dialogClassName, closePopupState }: PopupProps) {
    const [openPopup, setOpenPopup] = useState(false);
    useEffect(() => {
        if (closePopupState) {
            setOpenPopup(false);
        }
    }, [closePopupState]);
    return (
        <>
            <button onClick={() => { setOpenPopup(true) }} className={`bg-[#ff5722] text-white px-4 py-1 rounded hover:bg-[#e64a19] transition duration-300 ease-in-out ${className}`}>{btnText}</button>
            <Popup title={title} openPopup={openPopup} setOpenPopup={setOpenPopup} dialogClassName={dialogClassName}>
                {children}
            </Popup>
        </>
        )
}