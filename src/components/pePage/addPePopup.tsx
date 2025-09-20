import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
// import CreateUserForm from './createUserForm';
import CloseIcon from '@mui/icons-material/Close';
import { useOrg } from '../../context/orgsProvider';
import CreateProcessingElement from './CreatePeForm';
import { usePE } from '../../context/processingElementsProvider';
// import { useUsers } from '../../auth/usersProvider';


interface ProcessingElementPopupProps {
    openProcessingElementPopup: boolean;
    setOpenProcessingElementPopup: (value: boolean) => void;
}


const ProcessingElementPopup: React.FC<ProcessingElementPopupProps> = ({ openProcessingElementPopup, setOpenProcessingElementPopup }) => {
    const pe = usePE();


    return (
        <Dialog open={openProcessingElementPopup} onClose={() => setOpenProcessingElementPopup(false)} className="relative z-40 ">

            <div className="fixed inset-0 flex w-screen items-center justify-center sm:p-4 backdrop-blur-md 
            ">
                <DialogPanel className="relative sm:h-fit h-full space-y-4 border  bg-[#15283c] p-12 rounded sm:border-solid border-white border-none">
                    <CloseIcon onClick={() => setOpenProcessingElementPopup(false)} className="cursor-pointer absolute text-white right-5 top-5"></CloseIcon>

                    <DialogTitle className="font-bold text-white sm:text-3xl text-xl text-center ">Processing Element Request</DialogTitle>
                    <CreateProcessingElement setOpenAddProcessingElementPopup={setOpenProcessingElementPopup} ></CreateProcessingElement>
                    {pe.loadingProcessingElement &&
                        <div className="z-50 flex justify-center items-center absolute top-0 left-0 h-full w-full backdrop-blur-sm  px-12 py-8 sm:border-6 border-white sm:rounded-xl">
                            <div className="loader "></div>
                        </div>
                    }
                </DialogPanel>
            </div>

        </Dialog>

    )
}
export default ProcessingElementPopup;