import TopBar from './topBar.jsx'
import NavBar from './navBar.jsx';

const Header = ({page, setPage }) => {
    return (
        <div className="header relative top-0s mx-auto flex flex-col w-screen z-40">
            <TopBar />
            
            <NavBar page={page} setPage={setPage} />
        </div>
    )
}

export default Header