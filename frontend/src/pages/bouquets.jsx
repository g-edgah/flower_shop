import { useEffect, useState } from "react" 

import SideBar from '../components/common/sideBar.jsx'
import FlowerCard from '../components/home/flowerCard.jsx'
import Filter from '../components/common/filter.jsx'

const Bouquets = ({setPage}) => {
    const [sortOpen, setSortOpen] = useState(false)
    const [sortBy, setSortBy] = useState('newest')

    const toggleSort = () => {
        setSortOpen(!sortOpen)
    }

    const handleSort = (option) => {
        setSortBy(option)
        setSortOpen(false)
    }

    useEffect(() => {
        //ensures page is set to bouquets when navigation is through other channels apart from button clicking such as navigating back 
        setPage("bouquets")
    }, [])
    
    return (
        <div className="flex justify-center">
            <SideBar />
            <div className="boquets flex flex-col space-y-5 items-center max-w-250">
                <Filter handleSort={handleSort} toggleSort={toggleSort} sortOpen={sortOpen} sortBy={sortBy} />
                <div className="flower-row py-10 flex gap-5 w-full  flex-wrap justify-center items-center max-w-300">
                
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    
                </div>
            </div>
            
        </div>
    )
}

export default Bouquets