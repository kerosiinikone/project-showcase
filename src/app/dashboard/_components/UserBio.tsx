const UserBio = ({ content }: { content: string }) => {
    return (
        <div id="bio" className="flex flex-col m-6 mt-10">
            <h1>Bio</h1>
            <h2 className="text-md text-slate-500">{content}</h2>
        </div>
    )
}

export default UserBio
