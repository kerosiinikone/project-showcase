const UserBio = ({ content }: { content: string }) => {
    return (
        <div
            id="bio"
            className="flex flex-col md:p-6 md:pt-10 p-4 pt-6 md:border-0 border-t-2"
        >
            <h1>Bio</h1>
            <h2 className="text-md text-slate-500">{content}</h2>
        </div>
    )
}

export default UserBio
