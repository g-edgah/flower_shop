import TopBar from '../common/topBar.jsx'
import CartNavBar from './cartNavBar.jsx';

const CartHeader = () => {
    return (
        <div className="header mx-auto flex flex-col w-screen">
            <TopBar />
            <CartNavBar />
        </div>
    )
}

export default CartHeader