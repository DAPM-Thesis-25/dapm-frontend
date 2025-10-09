import { useAuth } from "../auth/authProvider";
import LoginForm from "../components/loginForm";
// import loginBg from "../imgs/login-bg.jpg";
export default function Login() {
    const auth = useAuth();
    return (
        // sm:bg-[url(./imgs/login-bg.jpg)]
        // sm:bg-none bg-[url(./imgs/login-bg.jpg)] 
        <div className="flex justify-center  items-center #15283c h-screen sm:bg-[#15283c] bg-cover bg-center bg-no-repeat">
            <div
                className="xl:w-[30%] xl:h-[63%] lg:w-[40%] lg:h-[60%] md:w-[60%] md:h-[60%] 
            sm:w-[70%] sm:h-[60%] h-[80%] w-full sm:p-8 p-5 sm:rounded-3xl rounded-none 
            sm:shadow-lg sm:shadow-black/30  bg-cover bg-center bg-no-repeat bg-[#f7f7f7]">
                <h2 className="text-[#15283c] text-center text-3xl font-bold">DAPM</h2>
                <LoginForm></LoginForm>
            </div>
            {auth.loadingLogin &&
                <div className="z-50 flex justify-center items-center absolute top-0 left-0 h-full w-full backdrop-blur-sm  px-12 py-8 sm:border-6 border-white sm:rounded-xl">
                    <div className="loader "></div>
                </div>
            }
        </div>
    )
}