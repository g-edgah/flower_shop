import { useEffect } from "react";

const Design = ({setPage, userData, isUserLoading, userError, isUserFetching, userRefetch }) => {

    useEffect(() => {
        //ensures page is set to occassions when navigation is through other channels apart from button clicking such as navigating back 
        setPage("design")
        userRefetch()
    }, [])

    return (
        <div>Design</div>
    )
}

export default Design