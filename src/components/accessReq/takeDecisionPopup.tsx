import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
// import CreateUserForm from './createUserForm';
import CloseIcon from '@mui/icons-material/Close';
import { useOrg } from '../../context/orgsProvider';
import TakeDecisionForm from './takeDecisionForm';
import { AccessRequest } from '../../api/accessRequests';
import { useAccessRequest } from '../../context/accessRequestsProvider';



interface TakeDecisionPopupProps {
    openTakeDecisionPopup: boolean;
    setOpenTakeDecisionPopup: (value: boolean) => void;
    accessREq: AccessRequest;

}
export default function TakeDecisionPopup({ openTakeDecisionPopup, setOpenTakeDecisionPopup, accessREq }: TakeDecisionPopupProps) {
    const access = useAccessRequest();


    return (
        <Dialog open={openTakeDecisionPopup} onClose={() => setOpenTakeDecisionPopup(false)} className="relative z-40 ">

            <div className="fixed inset-0 flex w-screen items-center justify-center sm:p-4 backdrop-blur-md 
            ">
                <DialogPanel className="relative sm:max-w-lg w-full sm:h-fit h-full space-y-4 border  bg-[#15283c] p-12 rounded sm:border-solid border-white border-none">
                    <CloseIcon onClick={() => setOpenTakeDecisionPopup(false)} className="cursor-pointer absolute text-white right-5 top-5"></CloseIcon>

                    {accessREq.status === "PENDING" ? (
                        <DialogTitle className="font-bold text-white sm:text-3xl text-xl text-center ">Take Decision on Request</DialogTitle>

                    ) : (
                        <DialogTitle className="font-bold text-white sm:text-2xl text-xl text-center ">Decision on Request</DialogTitle>

                    )
                    }

                    <TakeDecisionForm setOpenTakeDecisionPopup={setOpenTakeDecisionPopup} accessREq={accessREq} ></TakeDecisionForm>
                    {access?.takingDecisionLoading &&
                        <div className="z-50 flex justify-center items-center absolute top-0 left-0 h-full w-full backdrop-blur-sm  px-12 py-8 sm:border-6 border-white sm:rounded-xl">
                            <div className="loader "></div>
                        </div>
                    }
                </DialogPanel>
            </div>

        </Dialog>

    )
}
