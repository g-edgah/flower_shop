import { useEffect } from "react";

const Colors = ({setPage}) => {

    useEffect(() => {
        //ensures page is set to colors when navigation is through other channels apart from button clicking such as navigating back 
        setPage("colors")
    }, [])

    return (
        <div>colors</div>
    )
}

export default Colors