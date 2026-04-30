import TopBar from './topBar.jsx'
import NavBar from './navBar.jsx';

const Header = ({page, setPage }) => {
    return (
        <div className="header mx-auto flex flex-col w-screen z-40">
            <TopBar />
            <NavBar page={page} setPage={setPage} />
        </div>
    )
}

export default Header