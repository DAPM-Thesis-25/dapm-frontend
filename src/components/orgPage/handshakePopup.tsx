import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
// import CreateUserForm from './createUserForm';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../auth/authProvider';
import { useUser } from '../../context/usersProvides';
import CreateHandshakeForm from './CreateHandshakeForm';
import { useOrg } from '../../context/orgsProvider';
// import { useUsers } from '../../auth/usersProvider';


interface HandshakePopupProps {
    openHandshakePopup: boolean;
    setOpenHandshakePopup: (value: boolean) => void;
}


const HandshakePopup: React.FC<HandshakePopupProps> = ({ openHandshakePopup, setOpenHandshakePopup }) => {
    const org = useOrg();


    return (
        <Dialog open={openHandshakePopup} onClose={() => setOpenHandshakePopup(false)} className="relative z-40 ">

            <div className="fixed inset-0 flex w-screen items-center justify-center sm:p-4 backdrop-blur-md 
            ">
                <DialogPanel className="relative max-w-lg space-y-4 border  bg-[#15283c] p-12 rounded sm:border-solid border-white border-none">
                    <CloseIcon onClick={() => setOpenHandshakePopup(false)} className="cursor-pointer absolute text-white right-5 top-5"></CloseIcon>

                    <DialogTitle className="font-bold text-white sm:text-3xl text-xl text-center ">Handshake Request</DialogTitle>
                    <CreateHandshakeForm setOpenHandshakePopup={setOpenHandshakePopup} ></CreateHandshakeForm>
                    {org?.loadingHandshake &&
                        <div className="z-50 flex justify-center items-center absolute top-0 left-0 h-full w-full backdrop-blur-sm  px-12 py-8 sm:border-6 border-white sm:rounded-xl">
                            <div className="loader "></div>
                        </div>
                    }
                </DialogPanel>
            </div>

        </Dialog>

    )
}
export default HandshakePopup;