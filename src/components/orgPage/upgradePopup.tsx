import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
// import CreateUserForm from './createUserForm';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../auth/authProvider';
import { useUser } from '../../context/usersProvides';
import CreateHandshakeForm from './CreateHandshakeForm';
import { useOrg } from '../../context/orgsProvider';
// import { useUsers } from '../../auth/usersProvider';
import SellIcon from '@mui/icons-material/Sell';
import { useFormik } from "formik";
import * as Yup from 'yup';
interface UpgradePopupProps {
    openUpgradePopup: boolean;
    setOpenUpgradePopup: (value: boolean) => void;
    orgName: string;
}

const UpgradePopup: React.FC<UpgradePopupProps> = ({ openUpgradePopup, setOpenUpgradePopup, orgName }) => {
    const org = useOrg();

    const formik = useFormik({
        initialValues: {
            voucher: '',
            orgName: orgName
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            voucher: Yup.string().required('Voucher is required')

        }),
        onSubmit: async (values, { resetForm, setFieldError }) => {
            org.setLoadingUpgrade(true);

            const response = await org.upgradeRequest({ orgName: values.orgName, voucher: values.voucher });

            if (response.success) {
                setOpenUpgradePopup(false);
                resetForm();
            } else {
                setFieldError("voucher", response.message);
            }

            org.setLoadingUpgrade(false);
        }
    });


    return (
        <Dialog open={openUpgradePopup} onClose={() => setOpenUpgradePopup(false)} className="relative z-40 ">

            <div className="fixed inset-0 flex w-screen items-center justify-center sm:p-4 backdrop-blur-md 
            ">
                <DialogPanel className="relative max-w-lg space-y-4 border  bg-[#15283c] p-12 rounded sm:border-solid border-white border-none">
                    <CloseIcon onClick={() => setOpenUpgradePopup(false)} className="cursor-pointer absolute text-white right-5 top-5"></CloseIcon>

                    <DialogTitle className="font-bold text-white sm:text-xl text-xl text-center ">Upgrade Tier</DialogTitle>
                    <form className="flex  flex-col w-full py-1 signup" onSubmit={formik.handleSubmit}>
                        <div className="  w-full flex flex-col h-fit items-start content-start mb-2">
                            <h4 className="text-sm font-bold text-[#ffffff4d] ">Voucher</h4>
                            <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                                <SellIcon className=" text-white "></SellIcon>

                                <input
                                    type="text"
                                    placeholder="Voucher"
                                    className="w-full  h-fit pl-2  bg-transparent text-white"
                                    name="voucher"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.voucher}
                                />
                            </div>
                            {formik.touched.voucher && formik.errors.voucher ? (
                                <div className="text-red-500 text-xs text-start mt-1">{formik.errors.voucher}</div>
                            ) : null}
                            <p className="text-base mt-4 text-[#ffffff4d] text-center w-full">
                                You are about to upgrade <span className="text-white font-semibold">your tier level </span>
                                in <span className="text-[#ff5722]">{orgName}</span>.
                            </p>

                            <div className="w-full flex items-end grow justify-self-end   justify-center mt-8">
                                <button type="submit" className="text-white text-base sm:w-fit w-full sm:px-6 p-1 px-6 bg-[#15283c] hover:bg-[#ff5722] border-2 border-[#ff5722] rounded-md">Upgrade</button>

                            </div>
                        </div>
                    </form>
                    {org?.loadingUpgrade &&
                        <div className="z-50 flex justify-center items-center absolute top-0 left-0 h-full w-full backdrop-blur-sm  px-12 py-8 sm:border-6 border-white sm:rounded-xl">
                            <div className="loader "></div>
                        </div>
                    }
                </DialogPanel>
            </div>

        </Dialog>

    )
}
export default UpgradePopup;