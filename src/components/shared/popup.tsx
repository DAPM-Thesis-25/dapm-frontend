import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
// import CreateUserForm from './createUserForm';
import CloseIcon from '@mui/icons-material/Close';
import { useOrg } from '../../context/orgsProvider';
import { usePE } from '../../context/processingElementsProvider';

interface PopupProps {
    openPopup: boolean;
    setOpenPopup: (value: boolean) => void;
    title: string;
    children?: React.ReactNode;
    dialogClassName?: string;
}
export default function Popup({ openPopup, setOpenPopup, title, children, dialogClassName }: PopupProps) {
    //  const pe = usePE();


    return (
        <Dialog open={openPopup} onClose={() => setOpenPopup(false)} className="relative z-40 ">
            <div className="fixed inset-0 flex w-screen items-center justify-center sm:p-4 backdrop-blur-md 
            ">
                <DialogPanel className={`relative lg:w-[40%] md:w-[60%] sm:h-fit sm:max-h-[70%]   h-full space-y-4 border  bg-[#15283c] sm:p-12 p-4 rounded sm:border-solid border-white border-none overflow-y-auto  sm:w-[600px] w-full  search-popup ${dialogClassName}`}>
                    <CloseIcon onClick={() => setOpenPopup(false)} className="cursor-pointer absolute text-white right-5 top-5"></CloseIcon>

                    <DialogTitle className="font-bold text-white sm:text-3xl text-xl text-center ">{title}</DialogTitle>
                    {/* <CreateProcessingElement setOpenAddProcessingElementPopup={setOpenProcessingElementPopup} ></CreateProcessingElement> */}
                    {/* {pe.loadingProcessingElement &&
                        <div className="z-50 flex justify-center items-center absolute top-0 left-0 h-full w-full backdrop-blur-sm  px-12 py-8 sm:border-6 border-white sm:rounded-xl">
                            <div className="loader "></div>
                        </div>
                    } */}
                    {children}
                </DialogPanel>
            </div>

        </Dialog>

    )
}   