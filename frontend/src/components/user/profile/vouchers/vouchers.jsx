import { useEffect, useState } from "react";
import { useVouchers } from "../../../../hooks/user/user";

const Vouchers = ({  }) => {

    const { data, isLoading, error, userdata } = useVouchers();

    console.log("voucher data: ", data)


    return (
        <div className='p-3 flex flex-col gap-5'>
            
            
            <div className="title border-b border-gray-300 w-10/10 p-3">
                <span className="title text-xl font-bold ">Vouchers</span>
            </div>
            
            
            <div className="cont flex flex-col gap-3">
                {isLoading && <span>fetching orders</span>}
                {error && <span>error fetching orders: {error.message}</span>}
                {data && (
                    (data?.count === 0) ? (
                        <div className="w-full h-45 flex flex-col items-center justify-center gap-3">
                            <span className="text-lg">No vouchers found</span>
                        </div>
                    ) : (   
                    data?.vouchers.map((order) => (
                        order.items.map(item => 
                        <OrderCard key={item._id} order={order} item={item} status={order.status} deliveryDate={order.deliveryDate} orderDate={order.orderDate} trackingNo={order.trackingNumber} handleOrderDetails={handleOrderDetails} />
                        )
                    ))
                    )
                )}
            </div>
        </div>
    )
}

export default Vouchers