import LoginForm from "../components/loginForm";
// import loginBg from "../imgs/login-bg.jpg";
export default function Login() {
    return (
        <div className="flex justify-center  items-center h-screen sm:bg-none bg-[url(./imgs/login-bg.jpg)]  bg-cover bg-center bg-no-repeat">
            <div
                className="xl:w-[30%] xl:h-[63%] lg:w-[40%] lg:h-[60%] md:w-[60%] md:h-[60%] 
            sm:w-[70%] sm:h-[60%] h-[80%] w-full sm:p-8 p-5 sm:rounded-3xl rounded-none 
            shadow-lg shadow-black/30 sm:bg-[url(./imgs/login-bg.jpg)] bg-cover bg-center bg-no-repeat">
                <h2 className="text-white text-center text-3xl font-bold">DAMP</h2>
                <LoginForm></LoginForm>
            </div>
        </div>
    )
}