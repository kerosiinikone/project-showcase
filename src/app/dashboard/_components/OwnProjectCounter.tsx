const OwnProjectCounter = ({ count }: { count: number }) => {
    return (
        <div className="col-span-1 text-center flex flex-col px-2 md:px-10 py-2 w-fit items-center justify-center cursor-pointer rounded-lg hover:bg-slate-100 transition">
            <h1 className="font-medium hidden md:block">
                Own Projects
            </h1>
            <h2>{count}</h2>
        </div>
    )
}

export default OwnProjectCounter
