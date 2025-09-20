export default function Header({ title, button }: { title: string, button?: React.ReactNode }) {
    return (
        <div className="w-full bg-white md:p-7 p-5 shadow-md lg:mt-[5%] sm:mt-[10%] mt-[12%] flex justify-between">
            <h1 className="text-2xl font-semibold">{title}</h1>
            {
                button && <div className="">{button}</div>
            }
        </div>
    )
}