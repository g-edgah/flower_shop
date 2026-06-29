

const DiscountCard = ({ percent, disc, discount, image, disc_a, disc_b, disc_c, disc_d}) => {
    return (
        <div className={`h-60 bg-gray-300 w-115 ${image} bg-center bg-cover bg-no-repeat rounded-xl flex justify-center flex-col space-y-1 pl-10`}>
            <span className="w-50 text-lg">{disc} <span className="font-bold">{percent}</span> {discount}</span>
            <span className="">
                {disc_a} 
                <span className="line-through decoration-2 font-bold">{disc_c}</span>
            </span>
            <span className="">
                {disc_b}
                <span className="font-bold">{disc_d}</span>
            </span>
    
        </div>
    )
}

export default DiscountCard