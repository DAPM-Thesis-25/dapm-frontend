import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
// import CreateUserForm from './createUserForm';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../auth/authProvider';
import { useUser } from '../../context/usersProvides';
import { useOrg } from '../../context/orgsProvider';
import { useProject } from '../../context/projectProvider';
import CreateProjForm from './createProjForm';
interface CreateProjPopupProps {
    openCreateProjectPopup: boolean;
    setOpenCreateProjectPopup: (value: boolean) => void;
}

export default function CreateProjPopup({ openCreateProjectPopup, setOpenCreateProjectPopup }: CreateProjPopupProps) {
    const org = useOrg();
    const proj = useProject();


    return (
        <Dialog open={openCreateProjectPopup} onClose={() => setOpenCreateProjectPopup(false)} className="relative z-40 ">

            <div className="fixed inset-0 flex w-screen items-center justify-center sm:p-4 backdrop-blur-md 
            ">
                <DialogPanel className="relative sm:w-[60%] w-full sm:h-fit h-full space-y-4 border  bg-[#15283c] sm:p-12 p-4 rounded sm:border-solid border-white border-none">
                    <CloseIcon onClick={() => setOpenCreateProjectPopup(false)} className="cursor-pointer absolute text-white right-5 top-5"></CloseIcon>

                    <DialogTitle className="font-bold text-white sm:text-3xl text-xl text-center ">Create Project</DialogTitle>
                    <CreateProjForm setOpenCreateProjectPopup={setOpenCreateProjectPopup} ></CreateProjForm>
                    {proj?.loadingCreateProject &&
                        <div className="z-50 flex justify-center items-center absolute top-0 left-0 h-full w-full backdrop-blur-sm  px-12 py-8 sm:border-6 border-white sm:rounded-xl">
                            <div className="loader "></div>
                        </div>
                    }
                </DialogPanel>
            </div>

        </Dialog>

    )
}