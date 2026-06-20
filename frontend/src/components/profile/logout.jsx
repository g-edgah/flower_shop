


const Logout = () => {

    const handleLogout = () => {
        console.log("logging out")
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userId');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    }

    return (
        <div>
            <div className="title border-b border-gray-300 w-10/10 p-3">
                <span className="title text-xl font-bold ">Log out</span>
            </div>
            <div className="text flex flex-col items-center gap-5 p-6">
                <span className="query">
                    log out of your account?
                </span>
                <button  onClick={()=> handleLogout()} className='text-summaryButtonsText bg-summaryButtons w-30 h-9.5 md:h-10 rounded-md hover:bg-active transition font-semibold cursor-pointer'>log out</button>
            </div>
        </div>
    )
}

export default Logout