import Header from '../components/common/header.jsx';
import Footer from '../components/common/footer.jsx';


const ProfilePage = () => {
    return (
        <div className=" h-full w-full flex flex-col space-y-3 md:space-y-5 items-center">
            <Header />
            <div className="min-h-screen">profile</div>
            <Footer />
        </div>
    )
}

export default ProfilePage