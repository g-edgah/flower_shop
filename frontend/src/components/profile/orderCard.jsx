

const OrderCard = ({ order }) => {
    //console.log("order: ", order)
    const { items, total, orderDate, status } = order;

    return (
        <div className="order-card p-3 border rounded-md">
            <span>Order Date: {new Date(orderDate).toLocaleDateString()}</span>
            <span>Status: {status}</span>
            <span>Total Price: ${total.toFixed(2)}</span>
            <ul>
                {items.map((item) => (
                    <li key={item._id}>
                        {item.product.name} - Quantity: {item.quantity} - Price: ${item.price.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderCard;