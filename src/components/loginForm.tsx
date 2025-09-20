import { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from "../auth/authProvider";
import { useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password';
import DomainIcon from '@mui/icons-material/Domain';

export default function LoginForm(){
    const { loginAction } = useAuth();
    const [serverError, setServerError] = useState<string | any>(null);
    const navigate = useNavigate();
    const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      orgDomainName: "", 
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
      orgDomainName: Yup.string().required(
        "Organization domain name is required"
      ),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      const result = await loginAction({
        username: values.username,
        password: values.password
      }, values.orgDomainName);

      if (result) {
        // result will be error string if login failed
        setServerError(result);
        // setErrors({ username: result });
      }
      setSubmitting(false);
    },
  });
    return(
        <form className="sm:h-[90%]  h-[65%]  login flex  flex-col w-full" onSubmit={formik.handleSubmit}>




            <div className="  w-full flex flex-col h-fit items-start content-start xl:mt-18 lg:mt-15">
                <div className="login-input h-fit relative border-2 p-1 border-white w-full sm:mt-6 mt-10 flex items-center sm:rounded-none rounded-md">
                    <PersonIcon className=" text-white "></PersonIcon>
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full  h-fit pl-2  bg-transparent text-white"
                        name="username"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />

                </div>
                {formik.touched.username && formik.errors.username ? (
                    <div className="text-red-500 text-xs">{formik.errors.username}</div>
                ) : null}
                {
                    serverError && serverError[0].code==="DuplicateUserName"? <div className="text-red-500 text-xs">{serverError[0].description}</div>:null
                }
            </div>



            <div className="w-full flex flex-col">
            <div className="login-input relative  border-2 p-1 border-white  w-full  sm:mt-6 mt-2 flex items-center sm:rounded-none rounded-md">
                <PasswordIcon className=" text-white "></PasswordIcon>
                <input
                    type="text"
                    placeholder="Password"
                    className="w-full  pl-2  bg-transparent text-white"
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                
            </div>
            {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500 text-xs">{formik.errors.password}</div>
                ) : null}
                {
                    serverError ? <div className="text-red-500 text-xs">{serverError}</div>:null
                }
            </div>

            <div className="w-full flex flex-col">
            <div className="login-input relative  border-2 p-1 border-white  w-full  sm:mt-6 mt-2 flex items-center sm:rounded-none rounded-md">
                <DomainIcon className=" text-white "></DomainIcon>
                <input
                    type="text"
                    placeholder="orgDomainName"
                    className="w-full  pl-2  bg-transparent text-white"
                    name="orgDomainName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.orgDomainName}
                />
                
            </div>
            {formik.touched.orgDomainName && formik.errors.orgDomainName ? (
                    <div className="text-red-500 text-xs">{formik.errors.orgDomainName}</div>
                ) : null}
                {/* {
                    serverError ? <div className="text-red-500 text-xs">{serverError}</div>:null
                } */}
            </div>

            {/* <p className="text-base mt-4   text-[#ffffff4d] text-center w-full">
                Do Not Have an Account? <span onClick={()=>navigate("/login")} className="text-white">login</span>
            </p> */}
            <div className="w-full flex items-end grow justify-self-end   justify-center mt-6">
                <button type="submit" className="text-white text-xl sm:w-fit w-full sm:px-10 p-2 px-6 sm:bg-[#ff5722] bg-[#ff5722] rounded-md">Login</button>

            </div>

        </form>

    )
}