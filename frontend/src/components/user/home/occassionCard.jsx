import { IoIosBasket } from "react-icons/io";

const OccassionCard = ({title, text, image}) => {
    return (
        <div className={`relative snap-center h-73 md:h-150 w-[95vw] min-w-[95vw] md:w-234 md:min-w-234 bg-cartCard rounded-xl flex flex-col space-y-2 md:space-y-3`}>
            <div className={`image ${image} bg-cover bg-center bg-no-repeat h-8/10 rounded-t-xl`}></div>
            <div className="text bg-cartCard border border-white/20 flex rounded-xl flex-col absolute bottom-0 h-20 md:h-30 w-full justify-center space-y-2 md:space-y-3 items-center text-black">
                <span className="title font-bold text-lg">{title}</span>
                <span className="text">{text}</span>
            </div>
                    
        </div>
    )
}

export default OccassionCard 