import { useEffect } from "react";

const Design = ({setPage}) => {

    useEffect(() => {
        //ensures page is set to occassions when navigation is through other channels apart from button clicking such as navigating back 
        setPage("occassions")
    }, [])

    return (
        <div>Design</div>
    )
}

export default Design